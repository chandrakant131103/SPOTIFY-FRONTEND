import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { FiVolume2, FiVolumeX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle, FaStepBackward, FaStepForward } from "react-icons/fa";

export default function Player({ currentSong, playNext, playPrevious }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Default theme color (Pulse Purple)
    const [accentColor, setAccentColor] = useState('#8b5cf6');

    // 🛠️ NATIVE DYNAMIC THEMING (Using Canvas)
    useEffect(() => {
        if (currentSong?.coverUrl) {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Crucial for external URLs
            img.src = currentSong.coverUrl;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 1;
                canvas.height = 1;

                // Draw image into 1x1 pixel to get average color
                ctx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                
                setAccentColor(hex);
                document.documentElement.style.setProperty('--pulse-accent', hex);
            };
        }
    }, [currentSong]);

    // 📱 NATIVE MEDIA SESSION (Lock Screen Controls)
    useEffect(() => {
        if ('mediaSession' in navigator && currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist?.username || 'Unknown Artist',
                album: 'Pulse Music',
                artwork: [
                    { src: currentSong.coverUrl, sizes: '512x512', type: 'image/png' }
                ]
            });

            navigator.mediaSession.setActionHandler('play', togglePlayPause);
            navigator.mediaSession.setActionHandler('pause', togglePlayPause);
            navigator.mediaSession.setActionHandler('previoustrack', playPrevious || (() => {}));
            navigator.mediaSession.setActionHandler('nexttrack', playNext || (() => {}));
        }
    }, [currentSong, isPlaying]);

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
        <div style={{ width: '100%', textAlign: 'center', color: '#a7a7a7', fontSize: '14px', fontWeight: '600', padding: '20px' }}>
            Select a track to start listening
        </div>
    );

    const hdCover = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/1080/1080`;

    return (
        <>
            <audio ref={audioRef} src={currentSong.uri} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={playNext} />

            <div 
                onClick={() => setIsExpanded(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0 10px' }}
            >
                <div className="player-left" style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <img src={hdCover} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', boxShadow: `0 4px 15px ${accentColor}66` }} />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '4px', whiteSpace: 'nowrap' }}>{currentSong.title}</h4>
                        <p style={{ fontSize: '12px', color: '#a7a7a7' }}>{currentSong.artist?.username || 'Unknown Artist'}</p>
                    </div>
                </div>
                
                <div className="player-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                        <FaStepBackward size={16} onClick={(e) => { e.stopPropagation(); playPrevious?.(); }} style={{ cursor: 'pointer' }} />
                        <div onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} style={{ cursor: 'pointer', color: 'white' }}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward size={16} onClick={(e) => { e.stopPropagation(); playNext?.(); }} style={{ cursor: 'pointer' }} />
                    </div>
                    
                    <div className="player-seek" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', fontSize: '12px' }}>
                        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{ flex: 1, accentColor: accentColor }} />
                    </div>
                </div>

                <div className="player-right" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <FiChevronUp size={24} style={{ cursor: 'pointer' }} onClick={() => setIsExpanded(true)} />
                </div>
            </div>

            {isExpanded && createPortal(
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: `linear-gradient(to bottom, ${accentColor}cc 0%, #000000 90%)`,
                    zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '40px 20px', transition: 'background 0.5s ease'
                }}>
                    <FiChevronDown size={36} color="white" style={{ cursor: 'pointer', alignSelf: 'flex-start' }} onClick={() => setIsExpanded(false)} />

                    <img src={hdCover} alt="HD Cover" style={{ width: '100%', maxWidth: '380px', borderRadius: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', marginTop: '20px' }} />

                    <div style={{ width: '100%', maxWidth: '380px', marginTop: '40px' }}>
                        <h2 style={{ fontSize: '28px', color: 'white' }}>{currentSong.title}</h2>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>{currentSong.artist?.username}</p>
                    </div>

                    <div style={{ width: '100%', maxWidth: '380px', marginTop: '30px' }}>
                        <input type="range" min="0" max={duration || 100} value={currentTime} onChange={handleSeek} style={{ width: '100%', accentColor: 'white' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', marginTop: '10px' }}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '30px' }}>
                        <FaStepBackward size={28} color="white" onClick={playPrevious} />
                        <div onClick={togglePlayPause}>
                            {isPlaying ? <FaPauseCircle size={72} color="white" /> : <FaPlayCircle size={72} color="white" />}
                        </div>
                        <FaStepForward size={28} color="white" onClick={playNext} />
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
