import { createContext, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from '../Components/ToastContainer';
import trackService from '../Services/trackService';
import { db, STORAGE_KEYS } from '../Utils/indexedDB';

const AudioContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    // Replay modes: 'off' | 'repeat-one' | 'repeat-all'
    const REPLAY_MODES = ['off', 'repeat-all', 'repeat-one'];
    const [replayMode, setReplayMode] = useState(() => {
        try {
            const saved = localStorage.getItem('acapella_replay_mode');
            return REPLAY_MODES.includes(saved) ? saved : 'off';
        } catch {
            return 'off';
        }
    });
    // Backward-compat boolean flag
    const isReplay = replayMode !== 'off';
    const audioRef = useRef(null);
    const isMountedRef = useRef(true);
    const audioIdRef = useRef(0);
    const blobUrlRef = useRef(null);
    // Refs mirror state for use inside Audio element event listeners
    // (those listeners are created once and would otherwise capture stale state).
    const isShuffleRef = useRef(false);
    const replayModeRef = useRef('off');
    const currentTrackRef = useRef(null);
    // History of tracks played in this session — used to repopulate the
    // queue when in repeat-all mode and the queue is exhausted.
    const playedHistoryRef = useRef([]);
    // Snapshot of the queue's track-id order *before* shuffle was enabled,
    // so we can restore it when shuffle is turned off.
    const preShuffleOrderRef = useRef(null);
    // Stable sync guard — updated immediately in playTrack (unlike currentTrack
    // state which is async). Prevents re-creating the Audio element when the
    // same track is requested again (e.g. from a re-render during drag).
    const currentTrackIdRef = useRef(null);

    const revokeBlobUrl = () => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
    };

    const playTrack = async (track) => {
        // Use the synchronous ref (not async state) as the guard so that rapid
        // re-renders or drag events cannot sneak past this check.
        if (track && currentTrackIdRef.current === track.id && audioRef.current) {
            // Same track already loaded — just resume if paused
            if (!isPlaying) {
                audioRef.current.play()
                    .then(() => { if (isMountedRef.current) setIsPlaying(true); })
                    .catch(() => { if (isMountedRef.current) toast.error('Failed to play audio'); });
            }
            return;
        }

        // Stop current audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        revokeBlobUrl();

        // Update the sync ref BEFORE any async operations
        currentTrackIdRef.current = track ? track.id : null;
        currentTrackRef.current = track || null;
        setCurrentTrack(track);

        // Track playback history for repeat-all queue repopulation.
        if (track && track.id) {
            const hist = playedHistoryRef.current;
            const last = hist[hist.length - 1];
            if (!last || last.id !== track.id) {
                hist.push(track);
                // Cap history at a reasonable size to avoid unbounded growth.
                if (hist.length > 200) hist.shift();
            }
        }
        
        if (track && track.file_path) {
            // Increment audio ID to track this specific audio element
            audioIdRef.current += 1;
            const currentAudioId = audioIdRef.current;

            // Fetch the audio fully as a blob so seeking works regardless of
            // whether the server supports HTTP Range requests.
            // (php artisan serve does NOT properly support Range, which causes
            //  audio.currentTime to reset to 0 when seeking on streamed files.)
            let sourceUrl = track.file_path;
            try {
                const response = await fetch(track.file_path);
                if (!response.ok) throw new Error('Failed to fetch audio');
                const blob = await response.blob();

                // Abort if a newer track started while fetching
                if (audioIdRef.current !== currentAudioId) return;

                sourceUrl = URL.createObjectURL(blob);
                blobUrlRef.current = sourceUrl;
            } catch {
                if (isMountedRef.current) toast.error('Failed to load audio');
                return;
            }

            const audioElement = new Audio(sourceUrl);
            audioRef.current = audioElement;
            
            audioElement.addEventListener('ended', () => {
                if (!isMountedRef.current || audioIdRef.current !== currentAudioId) return;

                const mode = replayModeRef.current;

                // repeat-one: restart current track from 0 (queue order unchanged)
                if (mode === 'repeat-one') {
                    audioElement.currentTime = 0;
                    audioElement.play()
                        .then(() => { if (isMountedRef.current) setIsPlaying(true); })
                        .catch(() => {});
                    return;
                }

                setIsPlaying(false);
                // off & repeat-all both advance through the queue in order.
                // Shuffle is enforced by *physically* reordering the server
                // queue when toggled on, so the next item is always queue[0].
                playNextFromQueue(false, mode === 'repeat-all');
            });
            
            audioElement.addEventListener('error', (_e) => {
                // Only show toast for the current audio element
                if (isMountedRef.current && audioIdRef.current === currentAudioId) {
                    toast.error('Failed to play audio');
                }
            });
            
            audioElement.play()
                .then(() => {
                    if (isMountedRef.current && audioIdRef.current === currentAudioId) {
                        setIsPlaying(true);
                    }
                })
                .catch((_error) => {
                    if (isMountedRef.current && audioIdRef.current === currentAudioId) {
                        toast.error('Failed to play audio');
                    }
                });
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play()
                .catch(() => {
                    if (isMountedRef.current) {
                        toast.error('Failed to play audio');
                    }
                });
        }
        
        setIsPlaying(!isPlaying);
    };

    /**
     * Pure Fisher-Yates shuffle. Returns a NEW array — does not mutate input.
     */
    const fisherYatesShuffle = (arr) => {
        const out = arr.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };

    /**
     * Toggle shuffle.
     *
     * - ON  → snapshot the current queue's track-id order, then physically
     *         reorder the server queue: keep no tracks "above" the current
     *         one (current track is already playing, not in queue), and
     *         Fisher-Yates the remaining queue. "Up Next" UI reflects the
     *         new order immediately via the `queue-updated` event.
     *
     * - OFF → restore the snapshot order (filtered to track ids that still
     *         exist in the current queue, in case some were removed).
     *
     * Playback is NOT interrupted — only the queue order changes.
     */
    const toggleShuffle = async () => {
        const nextOn = !isShuffleRef.current;
        isShuffleRef.current = nextOn;
        setIsShuffle(nextOn);

        try {
            const response = await trackService.getQueue();
            const queueData = response.data || response || [];
            const currentIds = queueData.map((q) => q.track.id);

            if (nextOn) {
                // Save snapshot for later restoration
                preShuffleOrderRef.current = currentIds.slice();

                if (currentIds.length > 1) {
                    const shuffled = fisherYatesShuffle(currentIds);
                    await trackService.reorderQueue(shuffled);
                    window.dispatchEvent(new CustomEvent('queue-updated'));
                }
            } else {
                // Restore original order — keep only ids that still exist
                const snapshot = preShuffleOrderRef.current;
                if (snapshot && currentIds.length > 0) {
                    const existing = new Set(currentIds);
                    const restored = snapshot
                        .filter((id) => existing.has(id))
                        // append any new ids that were added during shuffle
                        .concat(currentIds.filter((id) => !snapshot.includes(id)));
                    if (restored.length > 0) {
                        await trackService.reorderQueue(restored);
                        window.dispatchEvent(new CustomEvent('queue-updated'));
                    }
                }
                preShuffleOrderRef.current = null;
            }
        } catch (err) {
            console.error('Failed to toggle shuffle:', err);
            // Roll back the UI flag on failure
            isShuffleRef.current = !nextOn;
            setIsShuffle(!nextOn);
            toast.error('Failed to shuffle queue');
        }
    };

    /**
     * Set replay mode explicitly.
     */
    const setReplayModeSafe = (mode) => {
        if (!REPLAY_MODES.includes(mode)) return;
        replayModeRef.current = mode;
        setReplayMode(mode);
        try { localStorage.setItem('acapella_replay_mode', mode); } catch { /* ignore localStorage errors */ }
    };

    /**
     * Cycle replay modes: off → repeat-all → repeat-one → off
     * (Spotify / YouTube Music style).
     */
    const cycleReplayMode = () => {
        const idx = REPLAY_MODES.indexOf(replayModeRef.current);
        const next = REPLAY_MODES[(idx + 1) % REPLAY_MODES.length];
        setReplayModeSafe(next);
    };

    // Backward-compatible toggle now cycles through the three modes.
    const toggleReplay = () => cycleReplayMode();

    // Sync replayModeRef on first mount (state initialized from localStorage).
    useEffect(() => {
        replayModeRef.current = replayMode;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const skipBackward = () => {
        if (audioRef.current) {
            const newTime = Math.max(0, audioRef.current.currentTime - 10);
            audioRef.current.currentTime = newTime;
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            const newTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
            audioRef.current.currentTime = newTime;
        }
    };

    /**
     * Advance to the next track.
     * @param {boolean} shuffle  pick a random queue item instead of the first
     * @param {boolean} repeatAll  when the queue is empty, repopulate it from
     *                             playback history and continue.
     */
    const playNextFromQueue = async (shuffle = false, repeatAll = false) => {
        try {
            let response = await trackService.getQueue();
            let queueData = response.data || response || [];

            // Repeat-all: if queue is empty, repopulate from history (excluding
            // the currently playing track to avoid an immediate re-play loop).
            if ((!queueData || queueData.length === 0) && repeatAll) {
                const history = playedHistoryRef.current;
                const currentId = currentTrackRef.current?.id;
                const toRequeue = history.filter((t, i) =>
                    // Exclude the very last (current) track, keep order
                    !(i === history.length - 1 && t.id === currentId)
                );

                if (toRequeue.length === 0) {
                    // Nothing to repeat — clear playing state.
                    setIsPlaying(false);
                    window.dispatchEvent(new CustomEvent('queue-updated'));
                    return;
                }

                for (const t of toRequeue) {
                    try {
                        await trackService.addToQueue(t.id);
                    } catch (err) {
                        console.error('repeat-all: failed to requeue', t.id, err);
                    }
                }
                // Refetch newly populated queue
                response = await trackService.getQueue();
                queueData = response.data || response || [];
                window.dispatchEvent(new CustomEvent('queue-updated'));
            }

            if (!queueData || queueData.length === 0) {
                // Queue exhausted and not repeating → stop.
                setIsPlaying(false);
                return;
            }

            // Shuffle: pick a random queue item; otherwise take the first
            const idx = shuffle ? Math.floor(Math.random() * queueData.length) : 0;
            const nextQueueItem = queueData[idx];
            const nextTrack = nextQueueItem.track;

            // Remove the track from queue before playing
            await trackService.removeFromQueue(nextQueueItem.id);
            window.dispatchEvent(new CustomEvent('queue-updated'));

            // Play the next track
            playTrack(nextTrack);
        } catch (error) {
            console.error('Failed to play next track from queue:', error);
        }
    };

    /**
     * Play all tracks in a list. Plays the first track immediately and
     * adds the remaining tracks to the queue so they auto-play next.
     */
    const playAllTracks = async (tracks) => {
        if (!tracks || tracks.length === 0) {
            toast.error('No tracks to play');
            return;
        }

        try {
            // Enforce 5-track queue limit for free users
            let isPremium = true;
            try {
                await db.init();
                const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);
                isPremium = !!(userData && userData.is_premium);
            } catch {
                isPremium = false;
            }

            // Clear existing queue first
            try {
                await trackService.clearQueue();
            } catch (err) {
                console.warn('Could not clear queue:', err);
            }

            // Reset history — a new "set" of tracks starts now, so repeat-all
            // should cycle this set rather than older sessions.
            playedHistoryRef.current = [];

            // Free users: play first + up to 5 more queued (6 total). Premium: all.
            const maxQueued = isPremium ? Infinity : 5;
            let remaining = tracks.slice(1, 1 + maxQueued);
            if (!isPremium && tracks.length > 1 + maxQueued) {
                toast.info(`Free users can queue up to ${maxQueued} tracks. Upgrade for unlimited.`);
            }

            // If shuffle is currently enabled, shuffle the new queue (excluding
            // the first track which is about to play immediately).
            if (isShuffleRef.current && remaining.length > 1) {
                remaining = fisherYatesShuffle(remaining);
                preShuffleOrderRef.current = tracks.slice(1, 1 + maxQueued).map(t => t.id);
            }

            for (const t of remaining) {
                try {
                    await trackService.addToQueue(t.id);
                } catch (err) {
                    console.error('Failed to add track to queue:', t.id, err);
                }
            }

            // Play the first track now
            await playTrack(tracks[0]);
        } catch (error) {
            console.error('Failed to play all tracks:', error);
            toast.error('Failed to start playback');
        }
    };

    const seekTo = (time) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(time)) {
            return false;
        }

        const duration = audio.duration;
        if (!Number.isFinite(duration) || duration <= 0) {
            return false;
        }

        const wasPlaying = !audio.paused;
        const nextTime = Math.max(0, Math.min(time, duration));

        audio.currentTime = nextTime;

        if (wasPlaying) {
            audio.play()
                .then(() => {
                    if (isMountedRef.current) {
                        setIsPlaying(true);
                    }
                })
                .catch(() => {
                    if (isMountedRef.current) {
                        toast.error('Failed to play audio');
                    }
                });
        }

        return true;
    };

    const stopTrack = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
        }
        revokeBlobUrl();
        currentTrackIdRef.current = null;
        setIsPlaying(false);
        setCurrentTrack(null);
        audioIdRef.current += 1;
    };

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
            if (blobUrlRef.current) {
                URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = null;
            }
        };
    }, []);

    // Background play enforcement: pause free users when tab is hidden
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden && audioRef.current && !audioRef.current.paused) {
                try {
                    await db.init();
                    const userData = await db.get('auth', STORAGE_KEYS.USER_DATA);
                    const isPremium = !!(userData && userData.is_premium);
                    if (!isPremium) {
                        audioRef.current.pause();
                        if (isMountedRef.current) {
                            setIsPlaying(false);
                            toast.info('Upgrade to Premium for background play');
                        }
                    }
                } catch {
                    // If we can't determine premium status, default to free (pause)
                    audioRef.current.pause();
                    if (isMountedRef.current) setIsPlaying(false);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    const value = {
        currentTrack,
        isPlaying,
        isShuffle,
        isReplay,
        replayMode,
        cycleReplayMode,
        setReplayMode: setReplayModeSafe,
        playTrack,
        playAllTracks,
        togglePlay,
        toggleShuffle,
        toggleReplay,
        skipBackward,
        skipForward,
        seekTo,
        stopTrack,
        audioRef,
    };

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

AudioProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
