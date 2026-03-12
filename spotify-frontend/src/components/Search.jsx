import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Search({ setCurrentSong }) {
    const [query, setQuery] = useState('');
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllMusic = async () => {
            try {
                const response = await api.get('/music/');
                setAllSongs(response.data.music);
                setFilteredSongs(response.data.music);
            } catch (err) {
                console.error("Search fetch error:", err);
                setError("Could not load music. Are you logged in as a Listener?");
            }
        };
        fetchAllMusic();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setFilteredSongs(allSongs);
            return;
        }
        
        const lowerCaseQuery = query.toLowerCase();
        const results = allSongs.filter(song => 
            song.title.toLowerCase().includes(lowerCaseQuery) || 
            (song.artist?.username && song.artist.username.toLowerCase().includes(lowerCaseQuery))
        );
        
        setFilteredSongs(results);
    }, [query, allSongs]);

    return (
        <div>
            {/* Custom Premium Search Bar */}
            <div style={{ marginBottom: '40px' }}>
                <input 
                    type="text" 
                    placeholder="What do you want to listen to?" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        padding: '16px 24px',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        fontSize: '16px',
                        outline: 'none',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        transition: 'border 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #ffffff'}
                    onBlur={(e) => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
            </div>

            <h2 className="section-title">
                {query ? 'Search Results' : 'Browse All Tracks'}
            </h2>

            {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

            <div className="song-grid">
                {filteredSongs.length > 0 ? (
                    filteredSongs.map(song => {
                        // Dynamic Image for Search Results
                        const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;

                        return (
                            <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                                    <img src={song.coverUrl || uniqueCover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3>{song.title}</h3>
                                <p>{song.artist?.username || 'Unknown Artist'}</p>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ color: '#a7a7a7', gridColumn: '1 / -1', fontSize: '16px' }}>
                        No results found for "{query}"
                    </p>
                )}
            </div>
        </div>
    );
}
