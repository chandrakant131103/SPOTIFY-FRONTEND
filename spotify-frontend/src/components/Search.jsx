import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Search({ setCurrentSong, externalQuery }) {
    const [query, setQuery] = useState(externalQuery || '');
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (externalQuery) {
            setQuery(externalQuery);
        }
    }, [externalQuery]);

    useEffect(() => {
        const fetchAllMusic = async () => {
            try {
                const response = await api.get('/music/');
                setAllSongs(response.data.music);
                setFilteredSongs(response.data.music);
                setError('');
            } catch (err) {
                console.error("Search fetch error:", err);
                setError("Could not load music.");
            }
        };
        fetchAllMusic();
    }, []);

    useEffect(() => {
        const lowerCaseQuery = query.toLowerCase();
        const results = allSongs.filter(song => 
            song.title.toLowerCase().includes(lowerCaseQuery) || 
            (song.artist?.username && song.artist.username.toLowerCase().includes(lowerCaseQuery))
        );
        setFilteredSongs(results);
    }, [query, allSongs]);

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
            <div style={{ marginBottom: '40px' }}>
                <input 
                    type="text" 
                    placeholder="Search for tracks or artists..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="auth-input"
                    style={{ 
                        width: '100%', maxWidth: '600px', padding: '18px 24px', borderRadius: '32px',
                        fontSize: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(139, 92, 246, 0.3)', margin: 0
                    }}
                />
            </div>

            <h2 className="section-title" style={{ color: '#fff' }}>
                {query ? `Results for "${query}"` : 'Browse All Tracks'}
            </h2>

            {error ? (
                <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                    <h3 style={{ marginBottom: '8px' }}>Cannot connect to Pulse Network</h3>
                    <p style={{ fontSize: '14px' }}>Please ensure your backend server is running and returning tracks.</p>
                </div>
            ) : filteredSongs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    <h3 style={{ color: '#fff', marginBottom: '10px' }}>No matches found</h3>
                    <p style={{ color: '#a7a7a7' }}>Try searching for a different keyword.</p>
                </div>
            ) : (
                <div className="song-grid">
                    {filteredSongs.map(song => {
                        const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;
                        return (
                            <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                                <div style={{ 
                                    width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', 
                                    marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.2)' 
                                }}>
                                    <img 
                                        src={song.coverUrl || uniqueCover} 
                                        alt="Cover" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.2)' }} 
                                    />
                                </div>
                                <h3>{song.title}</h3>
                                <p>{song.artist?.username || 'Unknown Artist'}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
