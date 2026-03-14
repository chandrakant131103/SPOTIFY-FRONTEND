import React, { useState, useEffect, useCallback } from 'react';
import api from './api/axiosConfig';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp, FiPlusSquare } from "react-icons/fi";
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
    const [queue, setQueue] = useState([]); // 🎵 Stores the current list for skipping
    const [activeTab, setActiveTab] = useState('home');
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // 🎵 Handlers for Skipping
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

    // This function is passed to children to play a song and set the queue
    const handlePlaySong = (song, songList = []) => {
        setCurrentSong(song);
        if (songList.length > 0) setQueue(songList);
    };

    useEffect(() => {
        const handlePrompt = (e) => { e.preventDefault(); setDeferredPrompt(e); };
        window.addEventListener('beforeinstallprompt', handlePrompt);
        return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
    }, []);

    const handleLogout = () => {
        setUser(null);
        setCurrentSong(null);
        localStorage.removeItem('pulse_session');
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <BsSoundwave size={28} color="#8b5cf6" />
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
                </div>

                <div className="dashboard-area">
                    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                        <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 'bold' }}>PREMIUM ACCOUNT</div>
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
                                {activeTab === 'home' && <Dashboard setCurrentSong={handlePlaySong} />}
                                {activeTab === 'search' && <Search setCurrentSong={handlePlaySong} />}
                                {activeTab === 'library' && <Library setCurrentSong={handlePlaySong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={handlePlaySong} />}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ⚡ Player now receives skip functions */}
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
