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

    // FIX: Fallback for image loading
    const songImage = currentSong.coverUrl || currentSong.imageUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked"));
            setIsPlaying(true);
        }
    }, [currentSong]);

    const togglePlayPause = (e) => {
        e.stopPropagation();
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play();
        setIsPlaying(!isPlaying);
    };

    if (!currentSong) return null;

    return (
        <>
            <audio 
                ref={audioRef} 
                src={currentSong.uri} 
                onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} 
                onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                onEnded={() => playNext?.()}
            />

            <div className="player-bar-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }} onClick={() => setIsExpanded(true)}>
                    <img src={songImage} alt="Cover" style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{currentSong.title}</div>
                        <div style={{ fontSize: '12px', color: '#b3b3b3' }}>{currentSong.artist?.username || 'Pulse Artist'}</div>
                    </div>
                </div>

                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
                        <FaStepBackward onClick={(e) => { e.stopPropagation(); playPrevious?.(); }} style={{ cursor: 'pointer' }} />
                        <div onClick={togglePlayPause}>
                            {isPlaying ? <FaPauseCircle size={36} /> : <FaPlayCircle size={36} />}
                        </div>
                        <FaStepForward onClick={(e) => { e.stopPropagation(); playNext?.(); }} style={{ cursor: 'pointer' }} />
                    </div>
                    <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => audioRef.current.currentTime = e.target.value} style={{ width: '100%', maxWidth: '400px' }} onClick={(e) => e.stopPropagation()} />
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <FiVolume2 size={20} />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(e.target.value); audioRef.current.volume = e.target.value; }} style={{ width: '80px' }} onClick={(e) => e.stopPropagation()} />
                    <FiChevronUp size={24} onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer' }} />
                </div>
            </div>
            {/* Expanded Portal code remains the same... */}
        </>
    );
}
