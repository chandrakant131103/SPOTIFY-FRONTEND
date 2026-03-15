import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { FiVolume2, FiChevronDown, FiChevronUp } from "react-icons/fi";
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

    // 🔊 Visualizer Setup Logic
    const initVisualizer = () => {
        if (!audioRef.current || analyzerRef.current) return;
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const src = audioCtx.createMediaElementSource(audioRef.current);
        const analyzer = audioCtx.createAnalyser();
        src.connect(analyzer);
        analyzer.connect(audioCtx.destination);
        analyzer.fftSize = 128;
        analyzerRef.current = analyzer;
    };

    useEffect(() => {
        if (isExpanded && canvasRef.current && analyzerRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const draw = () => {
                animationRef.current = requestAnimationFrame(draw);
                const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
                analyzerRef.current.getByteFrequencyData(dataArray);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                dataArray.forEach((val, i) => {
                    ctx.fillStyle = '#8b5cf6';
                    ctx.fillRect(i * 6, canvas.height - val / 2, 4, val / 2);
                });
            };
            draw();
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isExpanded]);

    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play().catch(() => setIsPlaying(false));
            setIsPlaying(true);
        }
    }, [currentSong]);

    const songArt = currentSong.coverUrl || currentSong.imageUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    return (
        <>
            <audio ref={audioRef} src={currentSong.uri} crossOrigin="anonymous"
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={playNext} 
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#121212', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }} onClick={() => { setIsExpanded(true); initVisualizer(); }}>
                    <img src={songArt} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ margin: 0, fontSize: '14px' }}>{currentSong.title}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#b3b3b3' }}>{currentSong.artist?.username}</p>
                    </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '5px' }}>
                        <FaStepBackward onClick={playPrevious} style={{ cursor: 'pointer' }} />
                        <div onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward onClick={playNext} style={{ cursor: 'pointer' }} />
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} style={{ width: '100%', accentColor: '#8b5cf6' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <FiVolume2 />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }} style={{ width: '80px' }} />
                    <FiChevronUp size={24} onClick={() => { setIsExpanded(true); initVisualizer(); }} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {isExpanded && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(to bottom, #1e1e1e, #000)', zIndex: 10000, padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <FiChevronDown size={40} onClick={() => setIsExpanded(false)} style={{ alignSelf: 'flex-start', cursor: 'pointer' }} />
                    <img src={songArt} style={{ width: '350px', borderRadius: '15px', marginTop: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }} />
                    
                    {/* Visualizer Canvas */}
                    <canvas ref={canvasRef} width="400" height="120" style={{ marginTop: '30px', filter: 'drop-shadow(0 0 10px #8b5cf6)' }} />

                    <h1 style={{ marginTop: '30px', fontSize: '32px' }}>{currentSong.title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '50px', marginTop: '40px' }}>
                        <FaStepBackward size={30} onClick={playPrevious} />
                        <div onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}>{isPlaying ? <FaPauseCircle size={80} /> : <FaPlayCircle size={80} />}</div>
                        <FaStepForward size={30} onClick={playNext} />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
