import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Dashboard({ setCurrentSong }) {
    const [songs, setSongs] = useState([]);
    const [likedIds, setLikedIds] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const musicRes = await api.get('/music/');
                setSongs(musicRes.data.music);
                
                const likedRes = await api.get('/music/liked');
                setLikedIds(likedRes.data.likedSongs.map(s => s._id));

                // Load Recently Played from LocalStorage
                const history = JSON.parse(localStorage.getItem('recent_pulse')) || [];
                setRecentlyPlayed(history);
            } catch (error) {
                console.error("Dashboard error", error);
            }
        };
        fetchData();
    }, []);

    const handlePlay = (song) => {
        setCurrentSong(song);
        
        // 🔥 Save to Recently Played
        let history = JSON.parse(localStorage.getItem('recent_pulse')) || [];
        history = [song, ...history.filter(s => s._id !== song._id)].slice(0, 6); // Keep last 6 unique songs
        localStorage.setItem('recent_pulse', JSON.stringify(history));
        setRecentlyPlayed(history);
    };

    const handleLike = async (e, songId) => {
        e.stopPropagation(); 
        try {
            const response = await api.post(`/music/like/${songId}`);
            setLikedIds(response.data.likedSongs);
        } catch (error) {}
    };

    return (
        <div>
            {/* 1. HERO SECTION */}
            <div style={{ 
                width: '100%', height: '280px', borderRadius: '15px', marginBottom: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
                display: 'flex', alignItems: 'center', padding: '40px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ zIndex: 2 }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '10px' }}>Neon Nights</h1>
                    <button className="btn" onClick={() => handlePlay(songs[0])}>Listen Now</button>
                </div>
                <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
            </div>

            {/* 2. RECENTLY PLAYED SECTION */}
            {recentlyPlayed.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h2 className="section-title">Recently Played</h2>
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {recentlyPlayed.map(song => (
                            <div key={song._id} onClick={() => handlePlay(song)} style={{ flex: '0 0 140px', cursor: 'pointer' }}>
                                <img 
                                    src={song.coverUrl || `https://picsum.photos/seed/${song._id}/400/400`} 
                                    style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', marginBottom: '8px', objectFit: 'cover' }} 
                                />
                                <p style={{ fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. MAIN GRID */}
            <h2 className="section-title">Recommended for You</h2>
            <div className="song-grid">
                {songs.map(song => {
                    const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;
                    return (
                        <div key={song._id} className="song-card" onClick={() => handlePlay(song)}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)' }}>
                                <img src={song.coverUrl || uniqueCover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.8) contrast(1.2)' }} />
                                <div onClick={(e) => handleLike(e, song._id)} style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '50%' }}>
                                    {likedIds.includes(song._id) ? <FaHeart size={18} color="#8b5cf6" /> : <FiHeart size={18} color="#ffffff" />}
                                </div>
                            </div>
                            <h3>{song.title}</h3>
                            <p>{song.artist?.username || 'Unknown Artist'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
