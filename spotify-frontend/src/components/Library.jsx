import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Library({ setCurrentSong }) {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

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
                    
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ boxShadow: '0 15px 50px rgba(139, 92, 246, 0.5)', borderRadius: '12px', overflow: 'hidden' }}>
                            <img 
                                src={selectedAlbum.coverUrl || `https://picsum.photos/seed/${selectedAlbum._id}/800/800`} 
                                alt="Album Cover" 
                                style={{ width: '220px', height: '220px', objectFit: 'cover', filter: 'saturate(1.8) contrast(1.2)' }} 
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', color: '#8b5cf6' }}>Album</p>
                            <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '8px' }}>{selectedAlbum.title}</h2>
                            <p style={{ color: '#b3b3b3', fontSize: '16px' }}>By {selectedAlbum.artist?.username}</p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {selectedAlbum.music?.map((song, index) => (
                            <div key={song._id} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ color: '#8b5cf6', fontWeight: '700' }}>{index + 1}</span>
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
                        {albums.map(album => {
                            const uniqueCover = `https://picsum.photos/seed/${album._id}/800/800`;
                            return (
                                <div key={album._id} className="song-card" onClick={() => handleAlbumClick(album._id)}>
                                    <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)' }}>
                                        <img 
                                            src={album.coverUrl || uniqueCover} 
                                            alt="Cover" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.8) contrast(1.2)' }} 
                                        />
                                    </div>
                                    <h3>{album.title}</h3>
                                    <p>{album.artist?.username}</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
