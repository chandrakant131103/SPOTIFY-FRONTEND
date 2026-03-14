import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { FiVolume2, FiVolumeX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function Player({ currentSong, playNext, playPrevious }) {
    const audioRef = useRef(null);
    const canvasRef = useRef(null);
    const analyzerRef = useRef(null);
    const animationRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const [accentColor, setAccentColor] = useState('#8b5cf6');

    // FIX: Support both coverUrl and imageUrl from your backend
    const songArt = currentSong.coverUrl || currentSong.imageUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    // 🔊 Visualizer Logic
    const initVisualizer = () => {
        if (!audioRef.current || analyzerRef.current) return;
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaElementSource(audioRef.current);
        const analyzer = ctx.createAnalyser();
        src.connect(analyzer);
        analyzer.connect(ctx.destination);
        analyzer.fftSize = 128;
        analyzerRef.current = analyzer;
    };

    useEffect(() => {
        if (isExpanded && canvasRef.current && analyzerRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);
                const data = new Uint8Array(analyzerRef.current.frequencyBinCount);
                analyzerRef.current.getByteFrequencyData(data);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                data.forEach((val, i) => {
                    ctx.fillStyle = accentColor;
                    ctx.fillRect(i * 4, canvas.height - val / 2, 3, val / 2);
                });
            };
            draw();
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isExpanded, accentColor]);

    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
        }
    }, [currentSong]);

    const togglePlay = () => {
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    if (!currentSong) return null;

    return (
        <>
            <audio ref={audioRef} src={currentSong.uri} crossOrigin="anonymous"
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={playNext} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#121212' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }} onClick={() => { setIsExpanded(true); initVisualizer(); }}>
                    <img src={songArt} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentSong.title}</div>
                        <div style={{ fontSize: '12px', color: '#b3b3b3' }}>{currentSong.artist?.username}</div>
                    </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '5px' }}>
                        <FaStepBackward onClick={playPrevious} style={{ cursor: 'pointer' }} />
                        <div onClick={togglePlay} style={{ cursor: 'pointer' }}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward onClick={playNext} style={{ cursor: 'pointer' }} />
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} style={{ width: '100%', accentColor: accentColor }} />
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <FiVolume2 size={20} />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }} style={{ width: '80px', accentColor: accentColor }} />
                    <FiChevronUp size={24} onClick={() => { setIsExpanded(true); initVisualizer(); }} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {isExpanded && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000', zIndex: 10000, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiChevronDown size={40} onClick={() => setIsExpanded(false)} style={{ alignSelf: 'flex-start', cursor: 'pointer' }} />
                    <img src={songArt} style={{ width: '300px', borderRadius: '12px', marginTop: '20px', boxShadow: `0 0 40px ${accentColor}44` }} />
                    <canvas ref={canvasRef} width="400" height="100" style={{ marginTop: '30px' }} />
                    <h1 style={{ marginTop: '20px' }}>{currentSong.title}</h1>
                    <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
                        <FaStepBackward size={30} onClick={playPrevious} />
                        <div onClick={togglePlay}>{isPlaying ? <FaPauseCircle size={80} /> : <FaPlayCircle size={80} />}</div>
                        <FaStepForward size={30} onClick={playNext} />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
