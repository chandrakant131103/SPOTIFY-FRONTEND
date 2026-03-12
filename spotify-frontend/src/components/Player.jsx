import React, { useState, useRef, useEffect } from 'react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";

export default function Player({ currentSong }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentSong]);

    if (!currentSong) return <div style={{ width: '100%', textAlign: 'center', color: '#a7a7a7' }}>Select a track to start listening</div>;

    const cover = currentSong.coverUrl || `https://picsum.photos/seed/${currentSong._id}/400/400`;

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <audio ref={audioRef} src={currentSong.uri} onEnded={() => setIsPlaying(false)} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* 🔥 Animated Glow applied here */}
                <img src={cover} className={isPlaying ? "playing-glow" : ""} style={{ width: '56px', height: '56px', borderRadius: '4px', objectFit: 'cover', transition: '0.3s' }} />
                <div>
                    <h4 style={{ fontSize: '14px', margin: 0 }}>{currentSong.title}</h4>
                    <p style={{ fontSize: '12px', color: '#a7a7a7', margin: 0 }}>{currentSong.artist?.username}</p>
                </div>
            </div>
            <div onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }} style={{ cursor: 'pointer' }}>
                {isPlaying ? <FaPauseCircle size={40} /> : <FaPlayCircle size={40} />}
            </div>
            <div style={{ width: '100px' }}> <FiVolume2 /> </div>
        </div>
    );
}
