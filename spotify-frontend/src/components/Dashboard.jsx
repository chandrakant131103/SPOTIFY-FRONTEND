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
            {/* --- DASHING HERO SECTION --- */}
            <div style={{ 
                width: '100%', height: '300px', borderRadius: '15px', marginBottom: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
                display: 'flex', alignItems: 'center', padding: '50px', position: 'relative',
                overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '800', letterSpacing: '3px', color: 'rgba(255,255,255,0.7)' }}>Featured Artist</span>
                    <h1 style={{ fontSize: '56px', fontWeight: '900', margin: '10px 0', lineHeight: 1 }}>Neon Nights</h1>
                    <p style={{ fontSize: '16px', marginBottom: '25px', color: 'rgba(255,255,255,0.8)' }}>Dive into the latest curated hits from underground electronic creators.</p>
                    <button className="btn" style={{ background: '#fff', color: '#000', borderRadius: '50px' }}>Listen Now</button>
                </div>
                {/* Decorative Glowing Circle */}
                <div style={{ 
                    position: 'absolute', right: '-10%', top: '-20%', width: '400px', height: '400px', 
                    background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(60px)' 
                }}></div>
            </div>

            <h2 className="section-title">Discover Weekly</h2>
            <div className="song-grid">
                {songs.map(song => {
                    const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;
                    return (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div style={{ 
                                width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', 
                                position: 'relative', marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)' 
                            }}>
                                <img 
                                    src={song.coverUrl || uniqueCover} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.8) contrast(1.2) brightness(1.1)' }} 
                                />
                                <div 
                                    onClick={(e) => handleLike(e, song._id)}
                                    style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '50%' }}
                                >
                                    {likedIds.includes(song._id) ? <FaHeart size={18} color="#8b5cf6" /> : <FiHeart size={18} color="#ffffff" />}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{song.title}</h3>
                            <p style={{ fontSize: '13px', color: '#a7a7a7' }}>{song.artist?.username || 'Unknown Artist'}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
