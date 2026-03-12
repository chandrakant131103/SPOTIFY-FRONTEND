import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        audioRef.current.currentTime = Number(e.target.value);
        setCurrentTime(Number(e.target.value));
    };

    if (!currentSong) return (
        <div style={{ width: '100%', textAlign: 'center', color: '#a7a7a7', fontSize: '14px', fontWeight: '600' }}>
            Select a track from the dashboard to start listening.
        </div>
    );

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <audio 
                ref={audioRef} 
                src={currentSong.uri} 
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)} 
                onEnded={() => setIsPlaying(false)} 
            />

            {/* --- LEFT: Song Info --- */}
            <div className="player-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img 
                    src={currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`} 
                    alt="Cover" 
                    style={{ width: '56px', height: '56px', borderRadius: '6px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} 
                />
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color: '#fff' }}>
                        {currentSong.title.includes('#') ? currentSong.title.split(' #')[0] : currentSong.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#a7a7a7', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {currentSong.artist?.username || 'Unknown Artist'}
                    </p>
                </div>
            </div>
            
            {/* --- CENTER: Controls & Seek --- */}
            <div className="player-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="player-controls" style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#b3b3b3' }}>
                    {/* Skip Back (Hidden on Mobile) */}
                    <FaStepBackward size={16} className="mobile-hide" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#b3b3b3'} />
                    
                    {/* Play/Pause (Always Visible) */}
                    <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'var(--pulse-primary)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
                    </div>
                    
                    {/* Skip Forward (Hidden on Mobile) */}
                    <FaStepForward size={16} className="mobile-hide" style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#b3b3b3'} />
                </div>
                
                {/* Seek Bar (Hidden entirely on mobile to save space) */}
                <div className="player-seek mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', minWidth: '350px', fontSize: '12px', color: '#a7a7a7' }}>
                    <span>{Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}</span>
                    <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{ flex: 1 }} />
                    <span>{Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}</span>
                </div>
            </div>

            {/* --- RIGHT: Volume --- */}
            <div className="player-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: '#a7a7a7' }}>
                <div style={{ cursor: 'pointer' }} onClick={() => { const newVol = volume === 0 ? 1 : 0; audioRef.current.volume = newVol; setVolume(newVol); }}>
                    {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </div>
                {/* The volume-slider class makes this narrower on mobile phones via index.css */}
                <input 
                    type="range" min="0" max="1" step="0.01" value={volume} 
                    onChange={(e) => {
                        const vol = Number(e.target.value);
                        audioRef.current.volume = vol;
                        setVolume(vol);
                    }} 
                    className="volume-slider" 
                    style={{ width: '100px' }} 
                />
            </div>
        </div>
    );
}
