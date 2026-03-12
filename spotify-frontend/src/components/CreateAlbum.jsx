import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function CreateAlbum() {
    const [title, setTitle] = useState('');
    const [musicIds, setMusicIds] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        const musicArray = musicIds.split(',').map(id => id.trim()).filter(id => id !== '');

        try {
            setLoading(true);
            setMessage('Creating album...');
            await api.post('/music/album', {
                title: title,
                music: musicArray
            });
            setMessage('Album created successfully!');
            setTitle('');
            setMusicIds('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create album. Check your IDs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px', color: '#fff', letterSpacing: '-1px' }}>Create an Album</h2>
            <p style={{ color: '#a7a7a7', marginBottom: '32px', fontSize: '16px' }}>Bundle your tracks into an official release.</p>
            
            <div className="glass-card" style={{ padding: '40px', borderRadius: '16px' }}>
                <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>ALBUM TITLE</label>
                        <input 
                            type="text" 
                            placeholder="e.g. The Midnight EP" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="auth-input" 
                            style={{ margin: 0 }} 
                            required 
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>TRACK IDs (COMMA SEPARATED)</label>
                        <textarea 
                            placeholder="Paste the MongoDB Object IDs of your uploaded tracks here..." 
                            value={musicIds} 
                            onChange={(e) => setMusicIds(e.target.value)} 
                            className="auth-input" 
                            style={{ margin: 0, height: '120px', resize: 'none' }} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn" style={{ padding: '16px', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'CREATING...' : 'CREATE ALBUM'}
                    </button>
                    
                    {message && <p style={{ textAlign: 'center', color: '#8b5cf6', fontWeight: 'bold', marginTop: '10px' }}>{message}</p>}
                </form>
            </div>
        </div>
    );
}
