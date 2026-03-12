
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Search({ setCurrentSong, externalQuery }) {
    const [query, setQuery] = useState(externalQuery || '');
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);

    // Sync with Sidebar Chips
    useEffect(() => {
        if (externalQuery !== undefined) setQuery(externalQuery);
    }, [externalQuery]);

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const res = await api.get('/music/');
                setAllSongs(res.data.music);
                setFilteredSongs(res.data.music);
            } catch (err) {
                console.error("Fetch error", err);
            }
        };
        fetchMusic();
    }, []);

    useEffect(() => {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) {
            setFilteredSongs(allSongs);
            return;
        }
        const results = allSongs.filter(s => 
            s.title.toLowerCase().includes(lowerQuery) || 
            s.artist?.username?.toLowerCase().includes(lowerQuery) ||
            (s.genre && s.genre.toLowerCase().includes(lowerQuery))
        );
        setFilteredSongs(results);
    }, [query, allSongs]);

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <input 
                    type="text" 
                    placeholder="Search for songs, artists, or genres..." 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="auth-input" 
                    style={{ maxWidth: '450px', borderRadius: '32px' }} 
                />
            </div>

            <h2 className="section-title">
                {query ? `Results for "${query}"` : 'Browse All Music'}
            </h2>

            {filteredSongs.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '80px 20px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.1)'
                }}>
                    <h3 style={{ color: '#fff', marginBottom: '10px' }}>No matches found</h3>
                    <p style={{ color: '#a7a7a7' }}>Try checking your spelling or searching for something else.</p>
                    <button 
                        className="btn btn-small btn-outline" 
                        style={{ marginTop: '20px' }}
                        onClick={() => setQuery('')}
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="song-grid">
                    {filteredSongs.map(song => (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.2)' }}>
                                <img 
                                    src={song.coverUrl || `https://picsum.photos/seed/${song._id}/800/800`} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.4)' }} 
                                />
                            </div>
                            <h3>{song.title}</h3>
                            <p>{song.artist?.username || 'Pulse Artist'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
