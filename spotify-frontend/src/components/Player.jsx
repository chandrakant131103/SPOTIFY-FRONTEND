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

    // --- 🔊 AUDIO VISUALIZER LOGIC ---
    const initVisualizer = () => {
        if (!audioRef.current || analyzerRef.current) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioRef.current);
        const analyzer = audioContext.createAnalyser();

        source.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 256; // Quality of bars
        analyzerRef.current = analyzer;
    };

    const drawVisualizer = () => {
        if (!canvasRef.current || !analyzerRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyzer = analyzerRef.current;
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const renderFrame = () => {
            animationRef.current = requestAnimationFrame(renderFrame);
            analyzer.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2;
                ctx.fillStyle = accentColor;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };
        renderFrame();
    };

    useEffect(() => {
        if (isExpanded) {
            initVisualizer();
            setTimeout(drawVisualizer, 100);
        } else {
            cancelAnimationFrame(animationRef.current);
        }
        return () => cancelAnimationFrame(animationRef.current);
    }, [isExpanded]);

    // --- 🎨 DYNAMIC THEME ---
    useEffect(() => {
        if (currentSong?.coverUrl) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = currentSong.coverUrl;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1; canvas.height = 1;
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                setAccentColor(`rgb(${r}, ${g}, ${b})`);
            };
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    if (!currentSong) return null;

    return (
        <>
            <audio ref={audioRef} src={currentSong.uri} 
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={() => playNext?.()}
                crossOrigin="anonymous" 
            />

            {/* --- BOTTOM BAR --- */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: '#121212', height: '90px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }} onClick={() => setIsExpanded(true)}>
                    <img src={currentSong.coverUrl} alt="art" style={{ width: '56px', height: '56px', borderRadius: '4px' }} />
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{currentSong.title}</div>
                        <div style={{ fontSize: '12px', color: '#b3b3b3' }}>{currentSong.artist?.username}</div>
                    </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                        <FaStepBackward onClick={() => playPrevious?.()} style={{ cursor: 'pointer' }} />
                        <div onClick={togglePlayPause} style={{ cursor: 'pointer' }}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward onClick={() => playNext?.()} style={{ cursor: 'pointer' }} />
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} style={{ width: '100%', accentColor: accentColor }} />
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <FiVolume2 size={20} />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }} style={{ width: '80px', accentColor: accentColor }} />
                    <FiChevronUp size={24} onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer' }} />
                </div>
            </div>

            {/* --- FULL SCREEN + VISUALIZER --- */}
            {isExpanded && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#000', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
                    <FiChevronDown size={40} onClick={() => setIsExpanded(false)} style={{ alignSelf: 'flex-start', cursor: 'pointer' }} />
                    
                    <img src={currentSong.coverUrl} style={{ width: '300px', borderRadius: '12px', marginTop: '20px', boxShadow: `0 0 50px ${accentColor}55` }} />
                    
                    {/* ⚡ THE VISUALIZER CANVAS */}
                    <canvas ref={canvasRef} width="600" height="150" style={{ width: '100%', maxWidth: '600px', marginTop: '40px' }} />

                    <h1 style={{ marginTop: '20px', fontSize: '32px' }}>{currentSong.title}</h1>
                    <p style={{ color: '#b3b3b3' }}>{currentSong.artist?.username}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '50px', marginTop: '40px' }}>
                        <FaStepBackward size={30} onClick={playPrevious} />
                        <div onClick={togglePlayPause}>
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
