import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";
import Visualizer from './Visualizer'; // 👈 Import Visualizer
import '../styles/Player.css'; // 👈 Import the CSS we wrote

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    
    const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop";

    useEffect(() => {
        if (currentSong && audioRef.current) {
            // Browsers often require a user gesture before auto-playing
            audioRef.current.play().catch(err => console.log("Playback blocked:", err));
            setIsPlaying(true);
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
    const handleLoadedMetadata = () => setDuration(audioRef.current.duration);
    
    const handleSeek = (e) => {
        const time = Number(e.target.value);
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolume = (e) => {
        const vol = Number(e.target.value);
        audioRef.current.volume = vol;
        setVolume(vol);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) return (
        <div style={{ width: '100%', textAlign: 'center', color: '#a7a7a7', fontSize: '14px', fontWeight: '600' }}>
            Select a track to start listening
        </div>
    );

    return (
        <div className="player-bar-container" style={{ width: '100%', position: 'relative' }}>
            
            {/* 1. THE VISUALIZER: Place it floating above the bar */}
            <div className="visualizer-container">
                <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
            </div>

            <audio 
                ref={audioRef} 
                src={currentSong.audioUrl} // 👈 Updated to match your backend field
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
                onEnded={() => setIsPlaying(false)} 
            />

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* Left: Dynamic Image Mapping */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%' }}>
                    <img 
                        src={currentSong.coverUrl || DEFAULT_COVER} // 👈 Multiple Covers fix
                        alt="Cover" 
                        style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7' }}>{currentSong.artist?.username}</p>
                    </div>
                </div>
                
                {/* Center: Controls & Professional Seek Bar */}
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                        <FaStepBackward size={18} className="icon-btn" style={{ cursor: 'pointer' }} />
                        <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'white' }}>
                            {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
                        </div>
                        <FaStepForward size={18} className="icon-btn" style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '11px', color: '#a7a7a7' }}>
                        <span>{formatTime(currentTime)}</span>
                        {/* 👈 Replaced standard input with the CSS-enhanced progress-container */}
                        <div className="progress-container" style={{ flex: 1, position: 'relative' }}>
                             <input 
                                type="range" 
                                min="0" 
                                max={duration || 100} 
                                value={currentTime} 
                                onChange={handleSeek} 
                                className="styled-seek-bar"
                             />
                             <div className="progress-bar-fill" style={{ width: `${(currentTime/duration)*100}%` }}></div>
                        </div>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Unrolling Volume Control */}
                <div className="volume-control" style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} className="volume-icon" />}
                    <div className="volume-slider-wrapper">
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} style={{ width: '100px' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
