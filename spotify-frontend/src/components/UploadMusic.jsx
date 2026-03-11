import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function UploadMusic() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('music', file); 

        try {
            setMessage('Uploading audio to server...');
            await api.post('/music/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Upload successful!');
            setTitle('');
            setFile(null);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Upload failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
            <form className="form-box" onSubmit={handleUpload}>
                <h2>Upload a Track</h2>
                <input type="text" placeholder="Track Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                
                <label style={{ color: '#a7a7a7', fontSize: '14px', marginTop: '10px' }}>Audio File (MP3, WAV)</label>
                <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} required />
                
                <button type="submit" className="btn" style={{ marginTop: '20px' }}>Upload Track</button>
                {message && <p style={{ textAlign: 'center', color: '#1DB954' }}>{message}</p>}
            </form>
        </div>
    );
}