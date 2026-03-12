import React, { useState } from 'react';
import api from './api/axiosConfig';
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiPlusSquare, FiHeart } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Library from './components/Library';
import Search from './components/Search';
import LikedSongs from './components/LikedSongs';

function App() {
    const [user, setUser] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryClick = (genre) => {
        setSearchQuery(genre);
        setActiveTab('search');
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#1DB954', padding: '6px', borderRadius: '8px' }}><BsSoundwave size={24} color="#fff" /></div>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>Pulse</h1>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                            {['Chill', 'Rock', 'Energy', 'Focus'].map(genre => (
                                <span key={genre} onClick={() => handleCategoryClick(genre)} className="genre-chip" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>{genre}</span>
                            ))}
                        </div>
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setSearchQuery(''); }}><GoHomeFill className="nav-icon" /> Home</div>
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}><GoSearch className="nav-icon" /> Search</div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '800' }}>PREMIUM</div>
                        <button className="btn btn-small btn-outline" onClick={() => setUser(null)}>Log out</button>
                    </div>
                    <div className="content-padding">
                        {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                        {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} externalQuery={searchQuery} />}
                        {activeTab === 'library' && <Library setCurrentSong={setCurrentSong} />}
                        {activeTab === 'liked' && <LikedSongs setCurrentSong={setCurrentSong} />}
                    </div>
                </div>
            </div>
            {user.role === 'user' && <div className="player-bar"><Player currentSong={currentSong} /></div>}
        </div>
    );
}
export default App;
