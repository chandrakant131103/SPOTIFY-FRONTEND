import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function CreateAlbum() {
    const [title, setTitle] = useState('');
    const [musicIds, setMusicIds] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        
        // Convert comma-separated string into an array of strings, trimming whitespace
        const musicArray = musicIds.split(',').map(id => id.trim()).filter(id => id !== '');

        try {
            setMessage('Creating album...');
            // Hitting your createAlbum controller
            await api.post('/music/album', {
                title: title,
                music: musicArray
            });
            setMessage('Album created successfully!');
            setTitle('');
            setMusicIds('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create album. Check your IDs.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
            <form className="form-box" onSubmit={handleCreateAlbum}>
                <h2>Create an Album</h2>
                
                <input 
                    type="text" 
                    placeholder="Album Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                
                <input 
                    type="text" 
                    placeholder="Music IDs (comma separated)" 
                    value={musicIds} 
                    onChange={(e) => setMusicIds(e.target.value)} 
                    required 
                />
                <small style={{ color: '#b3b3b3', marginTop: '-15px', marginBottom: '10px' }}>
                    Paste the MongoDB Object IDs of your uploaded tracks, separated by commas.
                </small>

                <button type="submit" className="btn">Create Album</button>
                {message && <p style={{ textAlign: 'center', color: '#1DB954' }}>{message}</p>}
            </form>
        </div>
    );
}