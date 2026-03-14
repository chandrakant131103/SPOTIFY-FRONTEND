import React, { useState, useEffect } from 'react';
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
    const [activeTab, setActiveTab] = useState('home');
    
    // ⚡ ADDED: PWA Install Prompt State
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // ⚡ ADDED: Listen for the browser's install prompt
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e); // Store the event so we can trigger it later
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    useEffect(() => {
        if (user) localStorage.setItem('pulse_session', JSON.stringify(user));
        else localStorage.removeItem('pulse_session');
    }, [user]);

    // ⚡ ADDED: Function to trigger the install prompt when button is clicked
    const handleInstallApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null); // Hide the button after successful install
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout'); 
        } catch (err) {
            console.error("Logout failed", err); // Fixed empty block for Vercel
        } 
        finally {
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
                        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '8px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)' }}>
                                <BsSoundwave size={24} color="#fff" />
                            </div>
                            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-1.5px' }}>Pulse</h1>
                        </div>
                        
                        {/* Dynamic Main Nav based on Role */}
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                            {user.role === 'artist' ? (
                                <><BsUpload className="nav-icon" /> Upload Track</>
                            ) : (
                                <><GoHomeFill className="nav-icon"/> Home</>
                            )}
                        </div>
                        
                        {/* ONLY Listeners can see the Search/Discover Tab */}
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
                                    <VscLibrary className="nav-icon"/> Your Collection
                                </div>
                                <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                                    <FiHeart className="nav-icon"/> Liked Tracks
                                </div>
                                
                                <div 
                                    className={`nav-item ${activeTab === 'charts' ? 'active' : ''}`} 
                                    onClick={() => setActiveTab('charts')}
                                    style={{ 
                                        marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', 
                                        paddingTop: '24px', color: activeTab === 'charts' ? '#8b5cf6' : 'var(--text-muted)' 
                                    }}
                                >
                                    <FiTrendingUp className="nav-icon" />
                                    <span>Pulse Charts</span>
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
                            
                            {/* ⚡ THE NEW INSTALL BUTTON (Only shows if browser allows it and app is not installed) */}
                            {deferredPrompt && (
                                <button 
                                    onClick={handleInstallApp} 
                                    className="btn btn-small" 
                                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)' }}
                                >
                                    Install App
                                </button>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '6px 16px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontWeight: '700', fontSize: '14px' }}>{user.username}</span>
                                <span style={{
                                    fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px',
                                    background: user.role === 'artist' ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)', 
                                    color: '#fff', padding: '4px 10px', borderRadius: '12px',
                                    boxShadow: user.role === 'artist' ? '0 0 10px rgba(236, 72, 153, 0.4)' : '0 0 10px rgba(59, 130, 246, 0.4)'
                                }}>
                                    {user.role}
                                </span>
                            </div>
                            <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    <div className="content-padding">
                        {/* Completely Removed Search from Artist Routing */}
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                                {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                                {activeTab === 'library' && <Library setCurrentSong={setCurrentSong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={setCurrentSong} />}
                                
                                {activeTab === 'charts' && (
                                    <div style={{ paddingBottom: '40px' }}>
                                        <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '8px', color: '#fff', letterSpacing: '-1px' }}>Pulse Charts</h2>
                                        <p style={{ color: '#a7a7a7', fontSize: '16px', marginBottom: '40px' }}>The most heavily rotated tracks on the network.</p>
                                        
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                                            {[
                                                { title: "Pulse Global 50", desc: "The definitive list of the biggest tracks right now.", link: "https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF", color: "linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)" },
                                                { title: "Viral Synths", desc: "Electronic tracks trending across the internet.", link: "https://open.spotify.com/playlist/37i9dQZEVXbLiRSasKsOU9", color: "linear-gradient(135deg, #ec4899 0%, #9d174d 100%)" },
                                                { title: "Deep Focus", desc: "Ambient sounds to lock in and get things done.", link: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", color: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)" },
                                                { title: "Neon Nights", desc: "The ultimate midnight driving playlist.", link: "https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioJC", color: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)" }
                                            ].map((chart, index) => (
                                                <a key={index} href={chart.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                    <div 
                                                        style={{
                                                            background: chart.color, padding: '30px', borderRadius: '16px',
                                                            height: '260px', display: 'flex', flexDirection: 'column',
                                                            justifyContent: 'flex-end', position: 'relative', overflow: 'hidden',
                                                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s',
                                                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', cursor: 'pointer'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.04) translateY(-8px)';
                                                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.7)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
                                                        }}
                                                    >
                                                        <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, transform: 'rotate(15deg)' }}>
                                                            <BsSoundwave size={160} color="#fff" />
                                                        </div>
                                                        <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '50%', backdropFilter: 'blur(10px)' }}>
                                                            <FiExternalLink size={18} color="#fff" />
                                                        </div>
                                                        <h3 style={{ color: '#fff', fontSize: '32px', fontWeight: '900', marginBottom: '10px', zIndex: 2, lineHeight: '1.1', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>{chart.title}</h3>
                                                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', lineHeight: '1.5', zIndex: 2 }}>{chart.desc}</p>
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
