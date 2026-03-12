import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function UploadMusic() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return setMessage("Please select a file.");
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('music', file); 

        try {
            setLoading(true);
            setMessage('Uploading audio to server...');
            await api.post('/music/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Upload successful!');
            setTitle('');
            setFile(null);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px', color: '#fff', letterSpacing: '-1px' }}>Upload a Track</h2>
            <p style={{ color: '#a7a7a7', marginBottom: '32px', fontSize: '16px' }}>Share your sound with the Pulse network.</p>
            
            <div className="glass-card" style={{ padding: '40px', borderRadius: '16px' }}>
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>TRACK TITLE</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Neon Horizon" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="auth-input" 
                            style={{ margin: 0 }} 
                            required 
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px' }}>AUDIO FILE (MP3 / WAV)</label>
                        <input 
                            type="file" 
                            accept="audio/*" 
                            onChange={(e) => setFile(e.target.files[0])} 
                            className="auth-input" 
                            style={{ margin: 0, padding: '12px' }} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn" style={{ padding: '16px', marginTop: '10px' }} disabled={loading}>
                        {loading ? 'UPLOADING...' : 'UPLOAD TRACK'}
                    </button>
                    
                    {message && <p style={{ textAlign: 'center', color: '#8b5cf6', fontWeight: 'bold', marginTop: '10px' }}>{message}</p>}
                </form>
            </div>
        </div>
    );
}
