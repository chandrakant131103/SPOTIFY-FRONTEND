import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function Dashboard({ setCurrentSong }) {
    const [songs, setSongs] = useState([]);
    const [likedIds, setLikedIds] = useState([]);

    const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop";

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
                {songs.map(song => (
                    <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                            
                            {/* The Default Cover Image */}
                            <img src={DEFAULT_COVER} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            {/* The Heart Icon */}
                            <div 
                                onClick={(e) => handleLike(e, song._id)}
                                style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '50%' }}
                            >
                                {likedIds.includes(song._id) ? (
                                    <FaHeart size={20} color="#1DB954" />
                                ) : (
                                    <FiHeart size={20} color="#ffffff" className="hover:scale-110" />
                                )}
                            </div>
                        </div>
                        <h3>{song.title}</h3>
                        <p>{song.artist?.username || 'Unknown Artist'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}