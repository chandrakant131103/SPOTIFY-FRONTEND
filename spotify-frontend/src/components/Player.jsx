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
            audioRef.current.load();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        isPlaying ? audioRef.current.pause() : audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!currentSong) return <div className="player-bar" style={{justifyContent: 'center', color: '#a7a7a7'}}>Select a track</div>;

    return (
        <div className="player-bar">
            <audio 
                ref={audioRef} 
                src={currentSong.audioUrl} 
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)} 
            />

            {/* Left: Info */}
            <div className="player-info" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '30%' }}>
                <img src={currentSong.coverUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '4px' }} />
                <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h4>
                    <p style={{ fontSize: '11px', color: '#a7a7a7' }}>{currentSong.artist?.username}</p>
                </div>
            </div>

            {/* Center: Controls */}
            <div className="player-controls" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <FaStepBackward size={16} />
                    <div onClick={togglePlayPause} style={{ cursor: 'pointer' }}>
                        {isPlaying ? <FaPauseCircle size={32} /> : <FaPlayCircle size={32} />}
                    </div>
                    <FaStepForward size={16} />
                </div>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', fontSize: '10px' }}>
                    <span>{formatTime(currentTime)}</span>
                    <input 
                        type="range" 
                        min="0" 
                        max={duration || 100} 
                        value={currentTime} 
                        onChange={(e) => { audioRef.current.currentTime = e.target.value; }} 
                        style={{ flex: 1 }} 
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Volume (Hidden on Mobile via CSS) */}
            <div className="volume-container">
                {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    audioRef.current.volume = v;
                }} className="volume-slider" />
            </div>
        </div>
    );
}
