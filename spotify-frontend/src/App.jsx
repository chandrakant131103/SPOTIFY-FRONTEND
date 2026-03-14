import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';

import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp, FiPlusSquare, FiExternalLink, FiUser } from "react-icons/fi";
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
            // ⚡ THE FIX: Re-attach token to Axios headers on refresh
            if (parsed.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            }
            return parsed;
        }
        return null;
    });
    
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]); // 🎵 Queue for Skip/Auto-next
    const [activeTab, setActiveTab] = useState('home');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // ⚡ ADDED: Dynamic Skip/Next Logic
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

    // Enhanced setter to capture the list context for the queue
    const handleSetSong = (song, list = []) => {
        setCurrentSong(song);
        if (list.length > 0) setQueue(list);
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

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
            setActiveTab('home');
            localStorage.removeItem('pulse_session');
            delete api.defaults.headers.common['Authorization'];
        }
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
                            {user.role === 'artist' ? <><BsUpload className="nav-icon" /> Upload Track</> : <><GoHomeFill className="nav-icon"/> Home</>}
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <GoSearch className="nav-icon"/> Discover
                        </div>
                    </div>

                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                            <VscLibrary className="nav-icon"/> Collection
                        </div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <FiHeart className="nav-icon"/> Liked Tracks
                        </div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px' }}>
                           <FiUser color="#8b5cf6" />
                           <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{user.username}</span>
                           <span style={{ fontSize: '10px', opacity: 0.6 }}>({user.role})</span>
                        </div>
                        
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
