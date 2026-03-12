import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Search({ setCurrentSong, externalQuery }) {
    const [query, setQuery] = useState(externalQuery || '');
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);

    useEffect(() => {
        if (externalQuery) setQuery(externalQuery);
    }, [externalQuery]);

    useEffect(() => {
        const fetchMusic = async () => {
            const res = await api.get('/music/');
            setAllSongs(res.data.music);
            setFilteredSongs(res.data.music);
        };
        fetchMusic();
    }, []);

    useEffect(() => {
        const results = allSongs.filter(s => 
            s.title.toLowerCase().includes(query.toLowerCase()) || 
            s.artist?.username?.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSongs(results);
    }, [query, allSongs]);

    return (
        <div>
            <input type="text" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="auth-input" style={{ maxWidth: '400px' }} />
            <h2 className="section-title">{query ? `Results for "${query}"` : 'Discover'}</h2>
            
            {/* 🔥 No Results Fallback */}
            {filteredSongs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#a7a7a7', padding: '40px' }}>
                    <h3>No songs found for "{query}"</h3>
                    <p>Try searching for a different genre or artist.</p>
                </div>
            ) : (
                <div className="song-grid">
                    {filteredSongs.map(song => (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <img src={song.coverUrl || `https://picsum.photos/seed/${song._id}/800/800`} style={{ width: '100%', borderRadius: '8px', filter: 'saturate(1.5)' }} />
                            <h3>{song.title}</h3>
                            <p>{song.artist?.username}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
