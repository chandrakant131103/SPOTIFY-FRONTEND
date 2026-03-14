import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiPlusSquare, FiUser } from "react-icons/fi";
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
        return saved ? JSON.parse(saved) : null;
    });
    
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]); 
    const [activeTab, setActiveTab] = useState('home');

    // --- 🎵 Fix: Skip Logic ---
    const playNext = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s._id === currentSong._id);
        if (index !== -1 && index < queue.length - 1) {
            setCurrentSong(queue[index + 1]);
        }
    }, [currentSong, queue]);

    const playPrevious = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const index = queue.findIndex(s => s._id === currentSong._id);
        if (index > 0) {
            setCurrentSong(queue[index - 1]);
        }
    }, [currentSong, queue]);

    const handlePlaySong = (song, list = []) => {
        setCurrentSong(song);
        setQueue(list);
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                {/* --- SIDEBAR RESTORED --- */}
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                            <BsSoundwave size={30} color="#8b5cf6" />
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Pulse</h1>
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            {user.role === 'artist' ? <><BsUpload /> Upload</> : <><GoHomeFill /> Home</>}
                        </div>
                        
                        {user.role === 'user' && (
                            <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                                <GoSearch /> Discover
                            </div>
                        )}
                    </div>

                    {/* --- COLLECTION & LIKED (Restored) --- */}
                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', color: '#555', marginBottom: '15px', paddingLeft: '15px' }}>YOUR LIBRARY</p>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                            <VscLibrary /> Collection
                        </div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <FiHeart /> Liked Tracks
                        </div>
                    </div>
                </div>

                <div className="dashboard-area">
                    {/* --- TOP BAR (User Role Badge Restored) --- */}
                    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#282828', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiUser color="#8b5cf6" />
                                <span style={{ fontWeight: 'bold' }}>{user.username}</span>
                                <span style={{ opacity: 0.5, fontSize: '10px' }}>({user.role.toUpperCase()})</span>
                            </div>
                        </div>
                        <button className="btn btn-small btn-outline" onClick={() => setUser(null)}>Log out</button>
                    </div>

                    <div className="content-padding">
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={handlePlaySong} />}
                                {activeTab === 'search' && <Search setCurrentSong={handlePlaySong} />}
                                {activeTab === 'library' && <Library setCurrentSong={handlePlaySong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={handlePlaySong} />}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {currentSong && (
                <div className="player-bar">
                    <Player currentSong={currentSong} playNext={playNext} playPrevious={playPrevious} />
                </div>
            )}
        </div>
    );
}
export default App;
