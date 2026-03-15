import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';

import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiUser, FiPlusSquare } from "react-icons/fi";
import { BsSoundwave, BsUpload } from "react-icons/bs";

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';
import UploadMusic from './components/UploadMusic'; 
import CreateAlbum from './components/CreateAlbum'; 

function App() {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('pulse_session');
        if (saved) {
            const parsed = JSON.parse(saved);
            // ⚡ THE FIX: Immediately re-attach token to Axios on refresh
            if (parsed.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            }
            return parsed;
        }
        return null;
    });
    
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]); // 🎵 Essential for Skip logic
    const [activeTab, setActiveTab] = useState('home');

    // 🎵 Global Play Next Logic
    const playNext = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s._id === currentSong._id);
        if (index !== -1 && index < queue.length - 1) {
            setCurrentSong(queue[index + 1]);
        }
    }, [currentSong, queue]);

    // 🎵 Global Play Previous Logic
    const playPrevious = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s._id === currentSong._id);
        if (index > 0) {
            setCurrentSong(queue[index - 1]);
        }
    }, [currentSong, queue]);

    // Setter that components like Dashboard will call to set the song + queue
    const handleSetSong = (song, songList = []) => {
        setCurrentSong(song);
        if (songList.length > 0) setQueue(songList);
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentSong(null);
        localStorage.removeItem('pulse_session');
        delete api.defaults.headers.common['Authorization'];
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '8px', borderRadius: '10px' }}>
                                <BsSoundwave size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0 }}>Pulse</h1>
                        </div>
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            {user.role === 'artist' ? <><BsUpload /> Upload</> : <><GoHomeFill /> Home</>}
                        </div>
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <GoSearch /> Discover
                        </div>
                    </div>

                    {/* --- RESTORED LIBRARY SECTIONS --- */}
                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                            <VscLibrary /> Collection
                        </div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <FiHeart /> Liked Tracks
                        </div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px' }}>
                           <FiUser color="#8b5cf6" />
                           <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.username} ({user.role})</span>
                        </div>
                        <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                    </div>

                    <div className="content-padding">
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={handleSetSong} />}
                                {activeTab === 'search' && <Search setCurrentSong={handleSetSong} />}
                                {activeTab === 'library' && <Library setCurrentSong={handleSetSong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={handleSetSong} />}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {user.role === 'user' && currentSong && (
                <div className="player-bar">
                    <Player 
                        currentSong={currentSong} 
                        playNext={playNext} 
                        playPrevious={playPrevious} 
                    />
                </div>
            )}
        </div>
    );
}
export default App;
