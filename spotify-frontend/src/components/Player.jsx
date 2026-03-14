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
    const [accentColor, setAccentColor] = useState('#8b5cf6');

    // 🛠️ SAFE DYNAMIC THEMING
    useEffect(() => {
        if (currentSong?.coverUrl) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = currentSong.coverUrl;

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 1;
                    canvas.height = 1;
                    ctx.drawImage(img, 0, 0, 1, 1);
                    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
                    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
                    setAccentColor(hex);
                    document.documentElement.style.setProperty('--pulse-accent', hex);
                } catch (e) {
                    console.log("Theme extraction skipped due to CORS");
                }
            };
        }
    }, [currentSong]);

    // 📱 SAFE MEDIA SESSION
    useEffect(() => {
        if ('mediaSession' in navigator && currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title || "Unknown Title",
                artist: currentSong.artist?.username || 'Unknown Artist',
                album: 'Pulse Music',
                artwork: [{ src: currentSong.coverUrl || '', sizes: '512x512', type: 'image/png' }]
            });

            navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
            navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
            // Using optional chaining to prevent crashes if props are missing
            navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious?.());
            navigator.mediaSession.setActionHandler('nexttrack', () => playNext?.());
        }
    }, [currentSong, isPlaying]);

    // 🎵 AUTO-PLAY ON SONG CHANGE
    useEffect(() => {
        if (currentSong && audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };
    
    const handleSeek = (e) => {
        const time = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const handleVolume = (e) => {
        const vol = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = vol;
            setVolume(vol);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) return null;

    const hdCover = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/600/600`;

    return (
        <>
            <audio 
                ref={audioRef} 
                src={currentSong.uri} 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
                onEnded={() => playNext?.()} 
            />

            {/* --- BOTTOM MINI PLAYER --- */}
            <div 
                onClick={() => setIsExpanded(true)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 15px', background: '#181818' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <img src={hdCover} alt="Cover" style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '13px', margin: 0, color: 'white' }}>{currentSong.title}</h4>
                        <p style={{ fontSize: '11px', color: '#b3b3b3', margin: 0 }}>{currentSong.artist?.username}</p>
                    </div>
                </div>
                
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3' }}>
                        <FaStepBackward onClick={(e) => { e.stopPropagation(); playPrevious?.(); }} style={{ cursor: 'pointer' }} />
                        <div onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
                            {isPlaying ? <FaPauseCircle size={32} color="white" /> : <FaPlayCircle size={32} color="white" />}
                        </div>
                        <FaStepForward onClick={(e) => { e.stopPropagation(); playNext?.(); }} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <FiChevronUp size={20} color="#b3b3b3" />
                </div>
            </div>

            {/* --- FULL SCREEN PLAYER --- */}
            {isExpanded && createPortal(
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: `linear-gradient(to bottom, ${accentColor}aa 0%, #000000 100%)`,
                    zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '20px', transition: 'background 0.5s ease'
                }}>
                    <FiChevronDown size={32} color="white" onClick={() => setIsExpanded(false)} style={{ cursor: 'pointer', alignSelf: 'flex-start' }} />

                    <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                        <img src={hdCover} alt="Art" style={{ width: '100%', borderRadius: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} />
                        
                        <div style={{ width: '100%', marginTop: '30px' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>{currentSong.title}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0' }}>{currentSong.artist?.username}</p>
                        </div>

                        <input 
                            type="range" min="0" max={duration || 100} value={currentTime} 
                            onChange={handleSeek} 
                            style={{ width: '100%', marginTop: '20px', accentColor: 'white' }} 
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginTop: '30px' }}>
                            <FaStepBackward size={24} color="white" onClick={() => playPrevious?.()} />
                            <div onClick={togglePlayPause}>
                                {isPlaying ? <FaPauseCircle size={64} color="white" /> : <FaPlayCircle size={64} color="white" />}
                            </div>
                            <FaStepForward size={24} color="white" onClick={() => playNext?.()} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
