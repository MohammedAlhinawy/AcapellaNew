import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function CustomAudioPlayer({ src }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        if (!src || !audioRef.current) return;

        const audio = audioRef.current;

        // Only create audio context if it doesn't exist
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;

        // Only create source if it doesn't exist
        if (!sourceRef.current) {
            sourceRef.current = audioContext.createMediaElementSource(audio);
        }

        if (!analyserRef.current) {
            analyserRef.current = audioContext.createAnalyser();
        }

        const analyser = analyserRef.current;
        const source = sourceRef.current;

        // Connect source to analyser and analyser to destination
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const drawWaveform = () => {
            if (!canvasRef.current) return;
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, width, height);
            
            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height;
                
                const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
                gradient.addColorStop(0, '#B8860B');
                gradient.addColorStop(1, '#FFD700');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }

            if (isPlaying) {
                animationRef.current = requestAnimationFrame(drawWaveform);
            }
        };

        if (isPlaying) {
            drawWaveform();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [src, isPlaying]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const handleProgress = (e) => {
        const audio = audioRef.current;
        const progress = e.target.value;
        audio.currentTime = (progress / 100) * duration;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ width: '100%', marginTop: '15px' }}>
            <audio ref={audioRef} src={src} />
            
            {/* Waveform Visualization */}
            <canvas
                ref={canvasRef}
                width={400}
                height={80}
                style={{
                    width: '100%',
                    height: '80px',
                    background: 'rgba(30, 30, 40, 0.5)',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            />
            
            {/* Controls */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '12px',
                background: 'rgba(30, 30, 40, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                {/* Play/Pause Button */}
                <button
                    type="button"
                    onClick={togglePlay}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isPlaying ? '#B8860B' : '#FFD700',
                        border: 'none',
                        color: '#000',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>

                {/* Progress Bar */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#fff', minWidth: '40px' }}>
                        {formatTime(currentTime)}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={(currentTime / duration) * 100 || 0}
                        onChange={handleProgress}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    />
                    <span style={{ fontSize: '12px', color: '#fff', minWidth: '40px' }}>
                        {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}

CustomAudioPlayer.propTypes = {
    src: PropTypes.string.isRequired,
};
