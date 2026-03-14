import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiUser } from "react-icons/fi";
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

    // --- 🎵 Fix: Reliable Skip Logic ---
    const playNext = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const currentIndex = queue.findIndex(s => s._id === currentSong._id);
        if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            setCurrentSong(queue[currentIndex + 1]);
        }
    }, [currentSong, queue]);

    const playPrevious = useCallback(() => {
        if (!currentSong || queue.length === 0) return;
        const currentIndex = queue.findIndex(s => s._id === currentSong._id);
        if (currentIndex > 0) {
            setCurrentSong(queue[currentIndex - 1]);
        }
    }, [currentSong, queue]);

    const handlePlaySong = (song, list = []) => {
        setCurrentSong(song);
        // If a list is provided (from Dashboard/Search), update the queue
        if (list.length > 0) setQueue(list);
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                            <BsSoundwave size={30} color="#8b5cf6" />
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>Pulse</h1>
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            {user.role === 'artist' ? <><BsUpload className="nav-icon" /> Upload</> : <><GoHomeFill className="nav-icon" /> Home</>}
                        </div>
                        
                        {user.role === 'user' && (
                            <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                                <GoSearch className="nav-icon" /> Discover
                            </div>
                        )}
                    </div>

                    {/* --- RE-ADDED SECTIONS --- */}
                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <p style={{ fontSize: '11px', color: '#555', marginBottom: '15px', paddingLeft: '15px', fontWeight: 'bold' }}>YOUR LIBRARY</p>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                            <VscLibrary className="nav-icon" /> Collection
                        </div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <FiHeart className="nav-icon" /> Liked Tracks
                        </div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px' }}>
                        {/* --- USER BADGE --- */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiUser color="#8b5cf6" />
                            <span style={{ fontWeight: '700', fontSize: '14px' }}>{user.username}</span>
                            <span style={{ fontSize: '10px', background: '#8b5cf6', padding: '2px 8px', borderRadius: '10px', color: 'white' }}>{user.role.toUpperCase()}</span>
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

            {/* --- PLAYER RENDERED --- */}
            {currentSong && (
                <div className="player-bar">
                    <Player currentSong={currentSong} playNext={playNext} playPrevious={playPrevious} />
                </div>
            )}
        </div>
    );
}
export default App;
