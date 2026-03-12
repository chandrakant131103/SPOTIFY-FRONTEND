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

    // 🔥 THE FIX: Generate the unique cover for the currently playing song
    const coverImage = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <audio ref={audioRef} src={currentSong.uri} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => setIsPlaying(false)} />

            {/* Left: Now Playing Info */}
            <div className="player-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* ⚡ Replaced DEFAULT_COVER with coverImage here */}
                <img src={coverImage} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h4>
                    <p style={{ fontSize: '12px', color: '#a7a7a7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist?.username || 'Unknown Artist'}</p>
                </div>
            </div>
            
            {/* Center: Controls */}
            <div className="player-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="player-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                    <FaStepBackward size={16} style={{ cursor: 'pointer' }} className="hover:text-white" />
                    <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'white' }}>
                        {isPlaying ? <FaPauseCircle size={36} className="hover:scale-105" /> : <FaPlayCircle size={36} className="hover:scale-105" />}
                    </div>
                    <FaStepForward size={16} style={{ cursor: 'pointer' }} className="hover:text-white" />
                </div>
                
                <div className="player-seek" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '12px', color: '#a7a7a7' }}>
                    <span>{formatTime(currentTime)}</span>
                    <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{ flex: 1 }} />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume */}
            <div className="player-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: '#a7a7a7' }}>
                {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} className="volume-slider" style={{ width: '100px' }} />
            </div>
        </div>
    );
}
