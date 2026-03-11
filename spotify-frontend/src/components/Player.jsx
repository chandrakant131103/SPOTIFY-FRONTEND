import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    
    const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop";

    // Re-sync playback when song changes
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.load(); // Force browser to acknowledge new source
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log("Manual play required"));
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
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
        <div style={{ width: '100%', textAlign: 'center', color: '#a7a7a7', padding: '20px' }}>
            Select a track to start listening
        </div>
    );

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
            {/* IMPORTANT: Use audioUrl to match your ImageKit backend */}
            <audio 
                ref={audioRef} 
                src={currentSong.audioUrl} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
                onEnded={() => setIsPlaying(false)} 
            />

            {/* Left: Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%' }}>
                <img 
                    src={currentSong.coverUrl || DEFAULT_COVER} 
                    alt="Cover" 
                    style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} 
                />
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '14px', margin: 0, color: 'white' }}>{currentSong.title}</h4>
                    <p style={{ fontSize: '12px', color: '#a7a7a7', margin: 0 }}>{currentSong.artist?.username}</p>
                </div>
            </div>
            
            {/* Center: Controls */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                    <FaStepBackward size={16} style={{ cursor: 'pointer' }} />
                    <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'white' }}>
                        {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                    </div>
                    <FaStepForward size={16} style={{ cursor: 'pointer' }} />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '12px', color: '#a7a7a7' }}>
                    <span>{formatTime(currentTime)}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 100} 
                        value={currentTime} 
                        onChange={handleSeek} 
                        style={{ flex: 1, accentColor: '#1DB954' }} 
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: '#a7a7a7' }}>
                {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={handleVolume} 
                    style={{ width: '100px', accentColor: '#1DB954' }} 
                />
            </div>
        </div>
    );
}
