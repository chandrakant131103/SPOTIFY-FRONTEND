import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FiMusic } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

export default function LikedSongs({ setCurrentSong }) {
    const [likedSongs, setLikedSongs] = useState([]);

    useEffect(() => {
        const fetchLiked = async () => {
            try {
                const response = await api.get('/music/liked');
                setLikedSongs(response.data.likedSongs);
            } catch (error) {
                console.error("Failed to fetch liked songs", error);
            }
        };
        fetchLiked();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #450af5, #c4efd9)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <FaHeart size={36} color="white" />
                </div>
                <div>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Playlist</p>
                    <h2 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-2px' }}>Liked Songs</h2>
                </div>
            </div>

            <div className="song-grid">
                {likedSongs.length > 0 ? (
                    likedSongs.map(song => (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div className="album-art">
                                <FiMusic size={48} strokeWidth={1} /> 
                            </div>
                            <h3>{song.title}</h3>
                            <p>{song.artist?.username || 'Unknown Artist'}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#a7a7a7' }}>You haven't liked any songs yet.</p>
                )}
            </div>
        </div>
    );
}