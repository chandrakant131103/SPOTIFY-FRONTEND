import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Library({ setCurrentSong }) {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    const DEFAULT_COVER = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop";

    // 1. Fetch all albums on load
    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await api.get('/music/albums');
                setAlbums(response.data.albums);
            } catch (error) {
                console.error("Failed to fetch albums", error);
            }
        };
        fetchAlbums();
    }, []);

    // 2. Fetch specific album details when clicked
    const handleAlbumClick = async (albumId) => {
        try {
            const response = await api.get(`/music/albums/${albumId}`);
            setSelectedAlbum(response.data.albums); 
        } catch (error) {
            console.error("Failed to fetch album details", error);
        }
    };

    return (
        <div>
            {selectedAlbum ? (
                <div>
                    <button className="btn btn-outline" style={{ marginBottom: '24px' }} onClick={() => setSelectedAlbum(null)}>
                        ← Back to Albums
                    </button>
                    
                    {/* Album Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
                        <img 
                            src={DEFAULT_COVER} 
                            alt="Album Cover" 
                            style={{ width: '200px', height: '200px', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', objectFit: 'cover' }} 
                        />
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Album</p>
                            <h2 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-2px', marginBottom: '8px' }}>{selectedAlbum.title}</h2>
                            <p style={{ color: '#b3b3b3', fontSize: '16px' }}>By {selectedAlbum.artist?.username}</p>
                        </div>
                    </div>
                    
                    {/* Tracklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedAlbum.music?.map((song, index) => (
                            <div key={song._id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }} className="hover:bg-white/10">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ color: '#a7a7a7', width: '20px' }}>{index + 1}</span>
                                    <span style={{ fontWeight: '500' }}>{song.title}</span>
                                </div>
                                <button className="btn btn-small" onClick={() => setCurrentSong(song)}>Play</button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <h2 className="section-title">Your Albums</h2>
                    <div className="song-grid">
                        {albums.map(album => (
                            <div key={album._id} className="song-card" onClick={() => handleAlbumClick(album._id)}>
                                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                                    <img src={DEFAULT_COVER} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3>{album.title}</h3>
                                <p>{album.artist?.username}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}