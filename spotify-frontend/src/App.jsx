import React, { useState } from 'react';
import api from './api/axiosConfig';

// Icons
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiPlusSquare, FiHeart } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <FaSpotify size={32} />
                            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Spotify</h2>
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