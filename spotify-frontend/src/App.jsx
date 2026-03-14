import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';

import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp, FiPlusSquare, FiExternalLink } from "react-icons/fi";
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
    const [songQueue, setSongQueue] = useState([]); // 🎵 Added: Store the current list of songs
    const [activeTab, setActiveTab] = useState('home');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // ⚡ PWA Install Logic
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    // 🎵 Queue Logic: Find and play next/previous songs
    const playNext = useCallback(() => {
        if (songQueue.length === 0 || !currentSong) return;
        const currentIndex = songQueue.findIndex(s => s._id === currentSong._id);
        if (currentIndex !== -1 && currentIndex < songQueue.length - 1) {
            setCurrentSong(songQueue[currentIndex + 1]);
        }
    }, [currentSong, songQueue]);

    const playPrevious = useCallback(() => {
        if (songQueue.length === 0 || !currentSong) return;
        const currentIndex = songQueue.findIndex(s => s._id === currentSong._id);
        if (currentIndex > 0) {
            setCurrentSong(songQueue[currentIndex - 1]);
        }
    }, [currentSong, songQueue]);

    // This function handles clicking a song from any component
    const handleSelectSong = (song, list = []) => {
        setCurrentSong(song);
        if (list.length > 0) setSongQueue(list);
    };

    useEffect(() => {
        if (user) localStorage.setItem('pulse_session', JSON.stringify(user));
        else localStorage.removeItem('pulse_session');
    }, [user]);

    const handleInstallApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') setDeferredPrompt(null);
        }
    };

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } 
        catch (err) { console.error("Logout failed", err); } 
        finally {
            setUser(null);
            setCurrentSong(null);
            setSongQueue([]);
            setActiveTab('home');
            localStorage.removeItem('pulse_session');
        }
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                
                {/* --- SIDEBAR --- */}
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '8px', borderRadius: '10px' }}>
                                <BsSoundwave size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px' }}>Pulse</h1>
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            {user.role === 'artist' ? <><BsUpload className="nav-icon" /> Upload</> : <><GoHomeFill className="nav-icon"/> Home</>}
                        </div>
                        
                        {user.role === 'user' && (
                            <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                                <GoSearch className="nav-icon"/> Discover
                            </div>
                        )}
                    </div>

                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        {user.role === 'user' ? (
                            <>
                                <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                                    <VscLibrary className="nav-icon"/> Collection
                                </div>
                                <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                                    <FiHeart className="nav-icon"/> Liked
                                </div>
                            </>
                        ) : (
                            <div className={`nav-item ${activeTab === 'create-album' ? 'active' : ''}`} onClick={() => setActiveTab('create-album')}>
                                <FiPlusSquare className="nav-icon"/> Create Release
                            </div>
                        )}
                    </div>
                </div>

                {/* --- DASHBOARD AREA --- */}
                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ color: '#8b5cf6', fontWeight: '900', letterSpacing: '2px', fontSize: '11px' }}>PULSE PREMIUM</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            {deferredPrompt && (
                                <button onClick={handleInstallApp} className="btn btn-small" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
                                    Install App
                                </button>
                            )}
                            <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    <div className="content-padding">
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={handleSelectSong} />}
                                {activeTab === 'search' && <Search setCurrentSong={handleSelectSong} />}
                                {activeTab === 'library' && <Library setCurrentSong={handleSelectSong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={handleSelectSong} />}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- FIXED PLAYER BAR --- */}
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
