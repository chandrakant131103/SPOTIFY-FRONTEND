import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Dashboard({ setCurrentSong }) {
    const [songs, setSongs] = useState([]);
    const [likedIds, setLikedIds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const musicRes = await api.get('/music/');
                setSongs(musicRes.data.music);
                
                const likedRes = await api.get('/music/liked');
                const ids = likedRes.data.likedSongs.map(song => song._id);
                setLikedIds(ids);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    const handleLike = async (e, songId) => {
        e.stopPropagation(); 
        try {
            const response = await api.post(`/music/like/${songId}`);
            setLikedIds(response.data.likedSongs);
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    return (
        <div>
            <h2 className="section-title">Made for You</h2>
            <div className="song-grid">
                {songs.map(song => {
                    // 🔥 HD Generator
                    const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;

                    return (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div style={{ 
                                width: '100%', 
                                aspectRatio: '1/1', 
                                borderRadius: '10px', 
                                overflow: 'hidden', 
                                position: 'relative', 
                                marginBottom: '16px', 
                                /* ⚡ Violet Glow Shadow */
                                boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)' 
                            }}>
                                
                                <img 
                                    src={song.coverUrl || uniqueCover} 
                                    alt="Cover" 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        /* ⚡ Color Supercharger Filter */
                                        filter: 'saturate(1.8) contrast(1.2) brightness(1.1)' 
                                    }} 
                                />
                                
                                <div 
                                    onClick={(e) => handleLike(e, song._id)}
                                    style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }}
                                    className="hover:scale-110"
                                >
                                    {likedIds.includes(song._id) ? (
                                        <FaHeart size={18} color="#8b5cf6" />
                                    ) : (
                                        <FiHeart size={18} color="#ffffff" />
                                    )}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>{song.title}</h3>
                            <p style={{ fontSize: '13px', color: '#a7a7a7' }}>{song.artist?.username || 'Unknown Artist'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
