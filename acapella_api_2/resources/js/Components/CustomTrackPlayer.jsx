import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaPause, FaShuffle, FaRepeat } from 'react-icons/fa6';
import { MdForward10, MdReplay10, MdRepeatOne } from "react-icons/md";
import { useAudio } from '../Context/AudioContext';
import '../../css/listener.css';
import '../../css/track-player.css';

const fmt = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function CustomTrackPlayer({ _src, duration }) {
    const { isPlaying, togglePlay, audioRef, seekTo, toggleShuffle, cycleReplayMode, skipBackward, skipForward, isShuffle, replayMode } = useAudio();
    // currentTime drives the fill width and timestamp display via React state
    // — but ONLY when NOT dragging. During drag we write to the DOM directly.
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(() => {
        const initialDuration = Number(duration);
        return Number.isFinite(initialDuration) && initialDuration > 0 ? initialDuration : 0;
    });

    const progressBarRef = useRef(null); // the outer clickable bar
    const fillRef       = useRef(null); // the purple fill div
    const currentTimeRef = useRef(null); // the <span> showing elapsed time

    const isDraggingRef      = useRef(false);
    const dragPendingTimeRef = useRef(0);
    const lastClientXRef = useRef(0);

    const getAudioDuration = () => {
        const audioDuration = audioRef.current?.duration;
        if (Number.isFinite(audioDuration) && audioDuration > 0) return audioDuration;

        const propDuration = Number(duration);
        if (Number.isFinite(propDuration) && propDuration > 0) return propDuration;

        return 0;
    };

    /* ── poll audioRef.current for currentTime ──
       audioRef is a stable ref object — its identity never changes, only
       .current does when AudioContext swaps in a new Audio() element.
       A useEffect([audioRef]) dependency would NEVER re-fire, so the
       timeupdate listener would be stuck on the first Audio element forever.
       Polling sidesteps this entirely and is cheap (250 ms interval). */
    useEffect(() => {
        const id = setInterval(() => {
            if (isDraggingRef.current) return; // drag owns the display
            const audio = audioRef.current;
            if (audio) {
                setCurrentTime(audio.currentTime);
                if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    setAudioDuration(audio.duration);
                }
            }
        }, 250);
        return () => clearInterval(id);
    }, [audioRef]); // runs once, always reads the latest audioRef.current via closure

    /* ── helpers ── */
    const getTimeFromClientX = (clientX) => {
        if (!progressBarRef.current) return 0;
        const seekDuration = getAudioDuration();
        if (!seekDuration) return null;
        const rect = progressBarRef.current.getBoundingClientRect();
        const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return pct * seekDuration;
    };

    // Write progress to DOM WITHOUT triggering a React re-render.
    // This is the key: no setState during drag → no re-render → PlayTrack
    // never gets a chance to call playTrack() again.
    const writeDOMProgress = (time) => {
        const audioDuration = getAudioDuration();
        const pct = audioDuration > 0 ? (time / audioDuration) * 100 : 0;
        if (fillRef.current)        fillRef.current.style.width = `${pct}%`;
        if (currentTimeRef.current) currentTimeRef.current.textContent = fmt(time);
    };

    /* ── mouse handlers ── */
    const handleMouseDown = (e) => {
        e.preventDefault(); // block browser drag / text-select
        isDraggingRef.current = true;

        // Disable CSS transition on the fill so it tracks instantly
        if (fillRef.current) fillRef.current.style.transition = 'none';

        lastClientXRef.current = e.clientX;
        const t = getTimeFromClientX(e.clientX);
        if (t === null) {
            isDraggingRef.current = false;
            if (fillRef.current) fillRef.current.style.transition = '';
            return;
        }
        dragPendingTimeRef.current = t;
        writeDOMProgress(t); // immediate visual feedback, zero state update

        const onMouseMove = (mv) => {
            lastClientXRef.current = mv.clientX;
            const tt = getTimeFromClientX(mv.clientX);
            if (tt === null) return;
            dragPendingTimeRef.current = tt;
            writeDOMProgress(tt);
        };

        const onMouseUp = (up) => {
            isDraggingRef.current = false;

            // Re-enable CSS transition
            if (fillRef.current) fillRef.current.style.transition = '';

            const committed = getTimeFromClientX(up.clientX || lastClientXRef.current);

            if (committed !== null && seekTo(committed)) {
                setCurrentTime(committed);
            }

            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup',   onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup',   onMouseUp);
    };

    const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="custom-track-player">
            <div
                className="track-progress-bar"
                ref={progressBarRef}
                onMouseDown={handleMouseDown}
            >
                <div
                    ref={fillRef}
                    className="track-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="track-time-display">
                <span ref={currentTimeRef} className="current-time">{fmt(currentTime)}</span>
                <span className="total-time">{fmt(audioDuration)}</span>
            </div>
            <div className="track-player-controls">
                <button className={`shuffle ${isShuffle ? 'active' : ''}`} onClick={toggleShuffle}>
                    <FaShuffle size={24} />
                </button>
                <button className='previous' onClick={skipBackward}>
                    <MdReplay10 size={36} />
                </button>
                <button
                    className='track-player-button'
                    onClick={togglePlay}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className='Next' onClick={skipForward}>
                    <MdForward10 size={36} />
                </button>
                <button
                    className={`replay ${replayMode !== 'off' ? 'active' : ''} mode-${replayMode}`}
                    onClick={cycleReplayMode}
                    title={
                        replayMode === 'off' ? 'Repeat: Off'
                        : replayMode === 'repeat-all' ? 'Repeat: All'
                        : 'Repeat: One'
                    }
                    aria-label={`Repeat ${replayMode}`}
                >
                    {replayMode === 'repeat-one'
                        ? <MdRepeatOne size={26} />
                        : <FaRepeat size={24} />}
                </button>
            </div>
        </div>
    );
}

CustomTrackPlayer.propTypes = {
    _src: PropTypes.string,
    duration: PropTypes.number.isRequired,
};
