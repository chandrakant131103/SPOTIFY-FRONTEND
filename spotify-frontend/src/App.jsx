import React, { useState } from 'react';
import api from './api/axiosConfig';

// Icons
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiPlusSquare, FiHeart } from "react-icons/fi";
// 1. Swapped FaSpotify for BsSoundwave
import { BsSoundwave } from "react-icons/bs"; 

// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import UploadMusic from './components/UploadMusic';
import Player from './components/Player';
import Library from './components/Library';
import CreateAlbum from './components/CreateAlbum';
import Search from './components/Search';
import LikedSongs from './components/LikedSongs'; 

function App() {
    const [user, setUser] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setCurrentSong(null);
            setActiveTab('home'); // Reset tab on logout
        }
    };

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                
                {/* Modern Sidebar */}
                <div className="sidebar">
                    <div className="sidebar-panel">
                        
                        {/* 2. The New Pulse Logo! */}
                        <div 
                          className="brand-logo" 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            marginBottom: '32px',
                            cursor: 'pointer',
                            padding: '0 8px'
                          }}
                        >
                          <div style={{ 
                            background: '#1DB954', /* Change this to #3b82f6 if you want a blue theme! */
                            padding: '6px', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            <BsSoundwave size={24} color="#000000" />
                          </div>
                          
                          <h1 style={{ 
                            fontSize: '24px', 
                            fontWeight: '800', 
                            color: '#ffffff', 
                            letterSpacing: '-0.5px',
                            margin: 0
                          }}>
                            Pulse
                          </h1>
                        </div>
                        
                        <div 
                            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('home')}
                        >
                            <span className="nav-icon">{activeTab === 'home' ? <GoHomeFill /> : <GoHome />}</span>
                            <span>Home</span>
                        </div>
                        
                        <div 
                            className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} 
                            onClick={() => setActiveTab('search')}
                        >
                            <span className="nav-icon"><GoSearch /></span>
                            <span>Search</span>
                        </div>
                    </div>

                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        {user.role === 'user' ? (
                            <>
                                <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
                                    <span className="nav-icon"><VscLibrary /></span>
                                    <span>Your Albums</span>
                                </div>
                                <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}>
                                    <span className="nav-icon"><FiHeart /></span>
                                    <span>Liked Songs</span>
                                </div>
                            </>
                        ) : (
                            <div className={`nav-item ${activeTab === 'create-album' ? 'active' : ''}`} onClick={() => setActiveTab('create-album')}>
                                <span className="nav-icon"><FiPlusSquare /></span>
                                <span>Create Album</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Area */}
                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ visibility: 'hidden' }}>Navigation Arrows</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'capitalize' }}>
                                {user.username} <span style={{ color: '#1DB954', fontSize: '12px' }}>({user.role})</span>
                            </span>
                            <button className="btn btn-small btn-outline" onClick={handleLogout}>Log out</button>
                        </div>
                    </div>

                    <div className="content-padding">
                        {/* --- ROUTING LOGIC --- */}
                        {user.role === 'artist' ? (
                            <>
                                {activeTab === 'home' && <UploadMusic />}
                                {activeTab === 'create-album' && <CreateAlbum />}
                                {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                            </>
                        ) : (
                            <>
                                {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                                {activeTab === 'library' && <Library setCurrentSong={setCurrentSong} />}
                                {activeTab === 'liked' && <LikedSongs setCurrentSong={setCurrentSong} />}
                                {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Player (Only visible to listeners) */}
            {user.role === 'user' && (
                <div className="player-bar">
                    <Player currentSong={currentSong} />
                </div>
            )}
        </div>
    );
}

export default App;
