import React, { useState, useRef, useEffect } from 'react';
// 🔥 Import createPortal to "teleport" the HD screen out of the bottom bar
import { createPortal } from 'react-dom'; 
import { FiVolume2, FiVolumeX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    
    // State to track if the HD screen is open
    const [isExpanded, setIsExpanded] = useState(false);
    
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

    // 🔥 HD IMAGE TRICK
    const hdCover = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/1080/1080`;
    const smallCover = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    return (
        <>
            {/* 1. AUDIO KEEPS PLAYING (Never unmounts, meaning no music interruptions!) */}
            <audio ref={audioRef} src={currentSong.uri} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={() => setIsPlaying(false)} />

            {/* 2. BOTTOM BAR (Click to expand) */}
            <div 
                onClick={() => setIsExpanded(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
                <div className="player-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={smallCover} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist?.username || 'Unknown Artist'}</p>
                    </div>
                </div>
                
                <div className="player-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div className="player-controls" style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                        <FaStepBackward size={16} onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }} className="hover:text-white" />
                        
                        {/* Stop Propagation prevents the click from expanding the player when you just want to pause */}
                        <div onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} style={{ cursor: 'pointer', color: 'white' }}>
                            {isPlaying ? <FaPauseCircle size={36} className="hover:scale-105" /> : <FaPlayCircle size={36} className="hover:scale-105" />}
                        </div>
                        
                        <FaStepForward size={16} onClick={(e) => e.stopPropagation()} style={{ cursor: 'pointer' }} className="hover:text-white" />
                    </div>
                    
                    <div className="player-seek" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '12px', color: '#a7a7a7' }}>
                        <span>{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={(e) => { e.stopPropagation(); handleSeek(e); }} style={{ flex: 1 }} />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                <div className="player-right" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', color: '#a7a7a7' }}>
                    {volume === 0 ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { e.stopPropagation(); handleVolume(e); }} className="volume-slider" style={{ width: '80px' }} />
                    <FiChevronUp size={24} style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={() => setIsExpanded(true)} className="hover:text-white" />
                </div>
            </div>

            {/* 3. HD FULL SCREEN POP-UP (Teleported out of the bottom bar) */}
            {isExpanded && createPortal(
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'linear-gradient(to bottom, #121212, #000000)', /* Clean Dark Theme */
                    zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '40px 20px', overflowY: 'auto'
                }}>
                    {/* Minimize Button */}
                    <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                        <FiChevronDown size={36} color="#ffffff" style={{ cursor: 'pointer' }} onClick={() => setIsExpanded(false)} className="hover:scale-105" />
                    </div>

                    {/* Massive HD Album Art */}
                    <img src={hdCover} alt="HD Cover" style={{ width: '100%', maxWidth: '400px', aspectRatio: '1/1', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', objectFit: 'cover' }} />

                    {/* Big Song Info */}
                    <div style={{ width: '100%', maxWidth: '400px', marginTop: '40px', textAlign: 'left' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>{currentSong.title}</h2>
                        <p style={{ fontSize: '18px', color: '#a7a7a7' }}>{currentSong.artist?.username || 'Unknown Artist'}</p>
                    </div>

                    {/* Big Seek Bar */}
                    <div style={{ width: '100%', maxWidth: '400px', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '15px', color: '#a7a7a7', fontSize: '14px' }}>
                        <span>{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{ flex: 1, height: '6px' }} />
                        <span>{formatTime(duration)}</span>
                    </div>

                    {/* Big Controls */}
                    <div style={{ width: '100%', maxWidth: '400px', marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px' }}>
                        <FaStepBackward size={28} color="#b3b3b3" style={{ cursor: 'pointer' }} className="hover:text-white" />
                        <div onClick={togglePlayPause} style={{ cursor: 'pointer', color: 'white' }}>
                            {isPlaying ? <FaPauseCircle size={72} className="hover:scale-105" /> : <FaPlayCircle size={72} className="hover:scale-105" />}
                        </div>
                        <FaStepForward size={28} color="#b3b3b3" style={{ cursor: 'pointer' }} className="hover:text-white" />
                    </div>
                </div>,
                document.body // This is the magic that tells it to render over the entire webpage!
            )}
        </>
    );
}
