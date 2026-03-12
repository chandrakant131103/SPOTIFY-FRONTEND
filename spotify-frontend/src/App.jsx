import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiMessageSquare } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";

// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';

function App() {
    // 🔥 Session Persistence Logic: Load user from localStorage on start
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('pulse_session');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const [currentSong, setCurrentSong] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    // 🔥 Save user to localStorage whenever the user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('pulse_session', JSON.stringify(user));
        } else {
            localStorage.removeItem('pulse_session');
        }
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
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#1DB954', padding: '6px', borderRadius: '8px' }}><BsSoundwave size={24} color="#fff" /></div>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Pulse</h1>
                        </div>
                        
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><GoHomeFill size={24}/> Home</div>
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}><GoSearch size={24}/> Search</div>
                    </div>

                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><VscLibrary size={24}/> Your Albums</div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}><FiHeart size={24}/> Liked Songs</div>
                        
                        {/* ⚡ Contributor Feature for Listeners */}
                        <div 
                            className={`nav-item ${activeTab === 'contribute' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('contribute')}
                            style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', color: '#1DB954' }}
                        >
                            <FiMessageSquare size={22} />
                            <span>Contribute</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '800', letterSpacing: '1px' }}>PREMIUM</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{fontWeight: '600'}}>{user.username}</span>
                            <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    <div className="content-padding">
                        {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                        {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                        {activeTab === 'library' && <Library setCurrentSong={setCurrentSong} />}
                        {activeTab === 'liked' && <LikedSongs setCurrentSong={setCurrentSong} />}
                        
                        {/* ⚡ Contribute Tab Content */}
                        {activeTab === 'contribute' && (
                            <div className="form-box" style={{maxWidth: '600px'}}>
                                <h2 className="section-title">Community Pulse</h2>
                                <p style={{color: '#a7a7a7', marginBottom: '20px'}}>Help us grow! Suggest new artists, genres, or report issues directly to our developers.</p>
                                <textarea 
                                    className="auth-input" 
                                    placeholder="Type your suggestion here..." 
                                    style={{height: '150px', resize: 'none', marginBottom: '20px'}}
                                />
                                <button className="btn" onClick={() => alert("Contribution received! Thank you for helping PULSE.")}>Submit Contribution</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {user.role === 'user' && <div className="player-bar"><Player currentSong={currentSong} /></div>}
        </div>
    );
}
export default App;
