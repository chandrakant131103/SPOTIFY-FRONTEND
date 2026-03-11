import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";
import Visualizer from './Visualizer'; 
import '../assets/player.css'; // Updated path to your assets folder

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    
    const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop";

    // Effect to handle song changes and auto-play
    useEffect(() => {
        if (currentSong && audioRef.current) {
            // Reset state for new song
            setCurrentTime(0);
            
            // Modern browsers require a "promise" check for .play()
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch(error => {
                        console.log("Auto-play prevented. User must interact first.", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, [currentSong]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
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
        <div className="player-placeholder" style={{ width: '100%', textAlign: 'center', color: '#a7a7a7', padding: '20px' }}>
            Select a track to start listening
        </div>
    );

    return (
        <div className="player-bar-container" style={{ width: '100%', position: 'relative' }}>
            
            <div className="visualizer-container">
                <Visualizer audioRef={audioRef} isPlaying={isPlaying} />
            </div>

            <audio 
                ref={audioRef} 
                src={currentSong.audioUrl} // Ensure backend sends 'audioUrl'
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
                onEnded={() => setIsPlaying(false)} 
            />

            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
                
                {/* Left: Info */}
                <div className="player-left" style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '30%' }}>
                    <img 
                        src={currentSong.coverUrl || DEFAULT_COVER} 
                        alt="Cover" 
                        style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} 
                    />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '14px', margin: 0, color: 'white' }}>{currentSong.title}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7', margin: 0 }}>{currentSong.artist?.username || "Artist"}</p>
                    </div>
                </div>
                
                {/* Center: Controls & Seek */}
                <div className="player-center" style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#b3b3b3' }}>
                        <FaStepBackward size={18} style={{ cursor: 'pointer' }} />
                        <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'white' }}>
                            {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
                        </div>
                        <FaStepForward size={18} style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <div className="seek-bar-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '11px', color: '#a7a7a7' }}>
                        <span>{formatTime(currentTime)}</span>
                        <div className="progress-container" style={{ flex: 1 }}>
                            <div className="progress-bar-bg"></div>
                            <div className="progress-bar-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                            <input 
                                type="range" 
                                min="0" 
                                max={duration || 100} 
                                value={currentTime} 
                                onChange={handleSeek} 
                                className="styled-seek-bar"
                            />
                        </div>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Volume */}
                <div className="player-right" style={{ width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <div className="volume-control">
                        <div onClick={() => handleVolume({ target: { value: volume === 0 ? 0.5 : 0 } })}>
                            {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} className="volume-icon" />}
                        </div>
                        <div className="volume-slider-wrapper">
                            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolume} style={{ width: '80px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
