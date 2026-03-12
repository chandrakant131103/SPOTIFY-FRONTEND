import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Search({ setCurrentSong }) {
    const [query, setQuery] = useState('');
    const [allSongs, setAllSongs] = useState([]);
    const [filteredSongs, setFilteredSongs] = useState([]);

    useEffect(() => {
        const fetchAllMusic = async () => {
            try {
                const response = await api.get('/music/');
                setAllSongs(response.data.music);
                setFilteredSongs(response.data.music);
            } catch (err) {
                console.error("Search fetch error:", err);
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
        <div>
            <div style={{ marginBottom: '40px' }}>
                <input 
                    type="text" 
                    placeholder="Search for tracks..." 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        width: '100%', maxWidth: '450px', padding: '16px 24px', borderRadius: '32px',
                        border: '1px solid rgba(139, 92, 246, 0.3)', backgroundColor: 'rgba(0,0,0,0.5)',
                        color: 'white', fontSize: '16px', outline: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                    }}
                />
            </div>

            <h2 className="section-title">{query ? 'Results' : 'Browse All'}</h2>

            <div className="song-grid">
                {filteredSongs.map(song => {
                    const uniqueCover = `https://picsum.photos/seed/${song._id}/800/800`;
                    return (
                        <div key={song._id} className="song-card" onClick={() => setCurrentSong(song)}>
                            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)' }}>
                                <img 
                                    src={song.coverUrl || uniqueCover} 
                                    alt="Cover" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.8) contrast(1.2)' }} 
                                />
                            </div>
                            <h3>{song.title}</h3>
                            <p>{song.artist?.username}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
