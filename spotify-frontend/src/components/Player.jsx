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

    // Fix: Image source logic
    const songImage = currentSong.coverUrl || currentSong.imageUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    // --- 🔊 Visualizer Logic ---
    const startVisualizer = () => {
        if (!audioRef.current || analyzerRef.current) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audioRef.current);
        const analyzer = audioCtx.createAnalyser();
        source.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        analyzer.fftSize = 128;
        analyzerRef.current = analyzer;
    };

    useEffect(() => {
        if (isExpanded && canvasRef.current && analyzerRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const analyzer = analyzerRef.current;
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);
                analyzer.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const barWidth = (canvas.width / bufferLength) * 2;
                let x = 0;
                for(let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    ctx.fillStyle = accentColor;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                }
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

    if (!currentSong) return null;

    return (
        <>
            <audio 
                ref={audioRef} src={currentSong.uri} crossOrigin="anonymous"
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={() => playNext?.()}
            />

            {/* --- MINI PLAYER BAR --- */}
            <div className="player-bar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }} onClick={() => { setIsExpanded(true); startVisualizer(); }}>
                    <img src={songImage} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{currentSong.title}</div>
                        <div style={{ fontSize: '12px', color: '#b3b3b3' }}>{currentSong.artist?.username}</div>
                    </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                        <FaStepBackward onClick={(e) => { e.stopPropagation(); playPrevious?.(); }} style={{ cursor: 'pointer' }} />
                        <div onClick={(e) => { e.stopPropagation(); isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward onClick={(e) => { e.stopPropagation(); playNext?.(); }} style={{ cursor: 'pointer' }} />
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} style={{ width: '100%', maxWidth: '400px', accentColor: accentColor }} />
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                    <FiVolume2 size={20} />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }} style={{ width: '80px', accentColor: accentColor }} />
                    <FiChevronUp size={24} onClick={() => { setIsExpanded(true); startVisualizer(); }} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {/* --- FULL SCREEN EXPANDED VIEW --- */}
            {isExpanded && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #121212, #000)', zIndex: 10000, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiChevronDown size={40} onClick={() => setIsExpanded(false)} style={{ alignSelf: 'flex-start', cursor: 'pointer' }} />
                    <img src={songImage} style={{ width: '100%', maxWidth: '350px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} />
                    
                    {/* Visualizer Canvas */}
                    <canvas ref={canvasRef} width="400" height="100" style={{ width: '100%', maxWidth: '400px', marginTop: '30px' }} />

                    <h1 style={{ marginTop: '20px', fontSize: '28px' }}>{currentSong.title}</h1>
                    <p style={{ color: '#b3b3b3' }}>{currentSong.artist?.username}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '40px' }}>
                        <FaStepBackward size={30} onClick={playPrevious} />
                        <div onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}>
                            {isPlaying ? <FaPauseCircle size={80} /> : <FaPlayCircle size={80} />}
                        </div>
                        <FaStepForward size={30} onClick={playNext} />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
