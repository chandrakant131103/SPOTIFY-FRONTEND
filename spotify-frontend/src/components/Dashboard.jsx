import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from 'react-hot-toast'; // ⚡ Using our new toast notifications

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
            
            // Trigger the slick notification!
            if (response.data.likedSongs.includes(songId)) {
                toast.success('Added to Liked Songs', { icon: '💙' }); // Blue heart emoji!
            } else {
                toast('Removed from Liked Songs', { icon: '💔' });
            }
        } catch (error) {
            console.error("Failed to toggle like", error);
            toast.error("Failed to update liked songs");
        }
    };

    return (
        <div>
            <h2 className="section-title">Made for You</h2>
            <div className="song-grid">
                {songs.map(song => {
                    const uniqueCover = `https://picsum.photos/seed/${song._id}/400/400`;

                    return (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', position: 'relative', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                                
                                <img 
                                    src={song.coverUrl || uniqueCover} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                
                                {/* The Heart Icon */}
                                <div 
                                    onClick={(e) => handleLike(e, song._id)}
                                    style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', background: 'rgba(0,0,0,0.6)', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }}
                                    className="hover:scale-110"
                                >
                                    {likedIds.includes(song._id) ? (
                                        <FaHeart size={18} color="#3b82f6" /> /* ⚡ Updated to Electric Blue */
                                    ) : (
                                        <FiHeart size={18} color="#ffffff" />
                                    )}
                                </div>
                            </div>
                            <h3 style={{ fontSize: '15px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {song.title}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#a7a7a7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {song.artist?.username || 'Unknown Artist'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
