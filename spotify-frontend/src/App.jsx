import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';

// Icons
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart, FiTrendingUp, FiPlusSquare } from "react-icons/fi"; // 🔥 Restored FiPlusSquare
import { BsSoundwave } from "react-icons/bs";

// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';
// 🔥 Restored Artist Components to fix production build
import UploadMusic from './components/UploadMusic'; 
import CreateAlbum from './components/CreateAlbum'; 

function App() {
    // Session Persistence
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
            await api.post('/auth/logout'); // 🔥 Proper backend logout
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
                        {/* ⚡ Dynamic Sidebar based on Role */}
                        {user.role === 'user' ? (
                            <>
                                <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                                    <VscLibrary size={24}/> Your Albums
                                </div>
                                <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                                    <FiHeart size={24}/> Liked Songs
                                </div>
                                
                                {/* Top Charts for Listeners */}
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
                            <>
                                {/* Artist Only Sidebar Items */}
                                <div className={`nav-item ${activeTab === 'create-album' ? 'active' : ''}`} onClick={() => setActiveTab('create-album')}>
                                    <FiPlusSquare size={24}/> Create Album
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* --- MAIN DASHBOARD AREA --- */}
                <div className="dashboard-area">
                    
                    {/* --- TOP NAV BAR --- */}
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '900', letterSpacing: '1px', fontSize: '12px' }}>PREMIUM</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            
                            {/* ⚡ THE ROLE BADGE */}
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

                    {/* --- CONTENT ROUTING --- */}
                    <div className="content-padding">
                        {/* ⚡ Dynamic Routing based on Role */}
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
                                
                                {/* Top Charts UI */}
                                {activeTab === 'charts' && (
                                    <div style={{ 
                                        padding: '40px', borderRadius: '12px', 
                                        background: 'linear-gradient(180deg, rgba(29, 185, 84, 0.15) 0%, rgba(0,0,0,0) 100%)',
                                        border: '1px solid rgba(29, 185, 84, 0.1)'
                                    }}>
                                        <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px', color: '#fff' }}>Global Top 50</h2>
                                        <p style={{ color: '#a7a7a7', fontSize: '16px', marginBottom: '40px' }}>Your daily update of the most played tracks right now.</p>
                                        
                                        <div style={{ 
                                            textAlign: 'center', padding: '80px 20px', background: 'rgba(0,0,0,0.4)', 
                                            borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' 
                                        }}>
                                            <FiTrendingUp size={48} color="#1DB954" style={{ marginBottom: '20px' }} />
                                            <h3 style={{ fontSize: '20px', color: '#fff', marginBottom: '8px' }}>Charts are compiling...</h3>
                                            <p style={{ color: '#a7a7a7' }}>Listen to more music to help your favorite artists reach the top!</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- PLAYER --- */}
            {user.role === 'user' && <div className="player-bar"><Player currentSong={currentSong} /></div>}
        </div>
    );
}
export default App;
