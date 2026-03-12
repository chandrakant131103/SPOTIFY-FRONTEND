import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';

// Icons
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp, FiPlusSquare, FiExternalLink } from "react-icons/fi"; // Added External Link Icon
import { BsSoundwave } from "react-icons/bs";

// Components
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
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        if (user) localStorage.setItem('pulse_session', JSON.stringify(user));
        else localStorage.removeItem('pulse_session');
    }, [user]);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); 
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setCurrentSong(null);
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
                        {user.role === 'user' ? (
                            <>
                                <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                                    <VscLibrary size={24}/> Your Albums
                                </div>
                                <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                                    <FiHeart size={24}/> Liked Songs
                                </div>
                                
                                <div 
                                    className={`nav-item ${activeTab === 'charts' ? 'active' : ''}`} 
                                    onClick={() => setActiveTab('charts')}
                                    style={{ 
                                        marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', 
                                        paddingTop: '20px', color: activeTab === 'charts' ? '#1DB954' : '#a7a7a7' 
                                    }}
                                >
                                    <FiTrendingUp size={22} />
                                    <span>Top Charts</span>
                                </div>
                            </>
                        ) : (
                            <div className={`nav-item ${activeTab === 'create-album' ? 'active' : ''}`} onClick={() => setActiveTab('create-album')}>
                                <FiPlusSquare size={24}/> Create Album
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MAIN DASHBOARD AREA --- */}
                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '900', letterSpacing: '1px', fontSize: '12px' }}>PREMIUM</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', 
                                padding: '6px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' 
                            }}>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>{user.username}</span>
                                <span style={{
                                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px',
                                    background: user.role === 'artist' ? '#8b5cf6' : '#1DB954', 
                                    color: user.role === 'artist' ? '#fff' : '#000',
                                    padding: '4px 10px', borderRadius: '12px',
                                    boxShadow: `0 0 10px ${user.role === 'artist' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(29, 185, 84, 0.4)'}`
                                }}>
                                    {user.role}
                                </span>
                            </div>
                            <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    <div className="content-padding">
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                                {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                                {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                                {activeTab === 'library' && <Library setCurrentSong={setCurrentSong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={setCurrentSong} />}
                                
                                {/* ⚡ NEW INTERACTIVE TOP CHARTS UI */}
                                {activeTab === 'charts' && (
                                    <div style={{ 
                                        padding: '40px', borderRadius: '12px', 
                                        background: 'linear-gradient(180deg, rgba(29, 185, 84, 0.15) 0%, rgba(0,0,0,0) 100%)',
                                        border: '1px solid rgba(29, 185, 84, 0.1)'
                                    }}>
                                        <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px', color: '#fff' }}>Featured Charts</h2>
                                        <p style={{ color: '#a7a7a7', fontSize: '16px', marginBottom: '40px' }}>Browse the most played tracks across global platforms.</p>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                                            {[
                                                { title: "Global Top 50", desc: "Your daily update of the most played tracks globally.", link: "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF", color: "linear-gradient(135deg, #1DB954 0%, #127533 100%)" },
                                                { title: "Viral 50", desc: "Viral tracks everyone is talking about right now.", link: "https://open.spotify.com/playlist/37i9dQZEVXbLiRSasKsNU9", color: "linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)" },
                                                { title: "Top 50 - India", desc: "The most streamed tracks in India today.", link: "https://open.spotify.com/playlist/37i9dQZEVXbLZ52XmnySJg", color: "linear-gradient(135deg, #f97316 0%, #9a3412 100%)" },
                                                { title: "Top 50 - USA", desc: "The most streamed tracks in the USA today.", link: "https://open.spotify.com/playlist/37i9dQZEVXbLRQDuF5jeBp", color: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)" }
                                            ].map((chart, index) => (
                                                <a 
                                                    key={index}
                                                    href={chart.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none' }}
                                                >
                                                    <div 
                                                        style={{
                                                            background: chart.color, padding: '24px', borderRadius: '12px',
                                                            height: '240px', display: 'flex', flexDirection: 'column',
                                                            justifyContent: 'flex-end', position: 'relative', overflow: 'hidden',
                                                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', cursor: 'pointer'
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'}
                                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                                                    >
                                                        {/* Faint Background Logo */}
                                                        <div style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.15 }}>
                                                            <BsSoundwave size={80} color="#fff" />
                                                        </div>
                                                        
                                                        {/* External Link Indicator */}
                                                        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '50%' }}>
                                                            <FiExternalLink size={16} color="#fff" />
                                                        </div>

                                                        <h3 style={{ color: '#fff', fontSize: '28px', fontWeight: '900', marginBottom: '8px', zIndex: 2, lineHeight: '1.1' }}>
                                                            {chart.title}
                                                        </h3>
                                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.4', zIndex: 2 }}>
                                                            {chart.desc}
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {user.role === 'user' && <div className="player-bar"><Player currentSong={currentSong} /></div>}
        </div>
    );
}
export default App;
