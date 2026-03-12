import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp } from "react-icons/fi"; // 🔥 Imported Trending Icon
import { BsSoundwave } from "react-icons/bs";

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';

function App() {
    // Session Persistence (Keeps you logged in on refresh)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('pulse_session');
        return saved ? JSON.parse(saved) : null;
    });
    
    const [currentSong, setCurrentSong] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        if (user) localStorage.setItem('pulse_session', JSON.stringify(user));
        else localStorage.removeItem('pulse_session');
    }, [user]);

    const handleLogout = () => {
        setUser(null);
        setCurrentSong(null);
        setActiveTab('home');
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                
                {/* --- SIDEBAR --- */}
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#1DB954', padding: '6px', borderRadius: '8px' }}>
                                <BsSoundwave size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Pulse</h1>
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            <GoHomeFill size={24}/> Home
                        </div>
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
                            <GoSearch size={24}/> Search
                        </div>
                    </div>

                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                            <VscLibrary size={24}/> Your Albums
                        </div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                            <FiHeart size={24}/> Liked Songs
                        </div>
                        
                        {/* ⚡ THE NEW FEATURE: TOP CHARTS */}
                        <div 
                            className={`nav-item ${activeTab === 'charts' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('charts')}
                            style={{ 
                                marginTop: '20px', 
                                borderTop: '1px solid rgba(255,255,255,0.1)', 
                                paddingTop: '20px', 
                                color: activeTab === 'charts' ? '#1DB954' : '#a7a7a7' 
                            }}
                        >
                            <FiTrendingUp size={22} />
                            <span>Top Charts</span>
                        </div>
                    </div>
                </div>

                {/* --- MAIN DASHBOARD AREA --- */}
                <div className="dashboard-area">
                    
                    {/* --- TOP NAV BAR --- */}
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '900', letterSpacing: '1px', fontSize: '12px' }}>PREMIUM</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2
