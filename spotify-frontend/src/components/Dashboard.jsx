import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Dashboard({ setCurrentSong }) {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchMusic = async () => {
            const res = await api.get('/music/');
            setSongs(res.data.music);
        };
        fetchMusic();
    }, []);

    return (
        <div>
            <div style={{ 
                width: '100%', height: '280px', borderRadius: '15px', marginBottom: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
                display: 'flex', alignItems: 'center', padding: '40px', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ zIndex: 2 }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '10px' }}>Neon Nights</h1>
                    <button className="btn" onClick={() => setCurrentSong(songs[0])}>Listen Now</button>
                </div>
            </div>

            <h2 className="section-title">Fresh Finds</h2>
            <div className="song-grid">
                {songs.map(song => (
                    <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                        <img src={song.coverUrl || `https://picsum.photos/seed/${song._id}/800/800`} style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', boxShadow: '0 8px 30px rgba(139,92,246,0.3)' }} />
                        <h3>{song.title}</h3>
                        <p>{song.artist?.username}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
