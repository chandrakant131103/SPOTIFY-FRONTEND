import React, { useState } from 'react';
import { GoHomeFill, GoSearch } from "react-icons/go";
import { VscLibrary } from "react-icons/vsc";
import { FiHeart } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import Search from './components/Search';
import Library from './components/Library';
import LikedSongs from './components/LikedSongs';

function App() {
    const [user, setUser] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [activeTab, setActiveTab] = useState('home');

    if (!user) return <Auth setUser={setUser} />;

    return (
        <div className="app-container">
            <div className="main-wrapper">
                <div className="sidebar">
                    <div className="sidebar-panel">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ background: '#8b5cf6', padding: '6px', borderRadius: '8px' }}><BsSoundwave size={24} color="#fff" /></div>
                            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Pulse</h1>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                            {['Chill', 'Rock', 'Energy', 'Focus'].map(genre => (
                                <span key={genre} className="genre-chip">{genre}</span>
                            ))}
                        </div>
                        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}><GoHomeFill size={24}/> Home</div>
                        <div className={`nav-item ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}><GoSearch size={24}/> Search</div>
                    </div>
                    <div className="sidebar-panel" style={{ flex: 1 }}>
                        <div className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><VscLibrary size={24}/> Your Albums</div>
                        <div className={`nav-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => setActiveTab('liked')}><FiHeart size={24}/> Liked Songs</div>
                    </div>
                </div>

                <div className="dashboard-area">
                    <div className="top-bar">
                        <div style={{ color: '#1DB954', fontWeight: '800' }}>PREMIUM</div>
                        <button className="btn btn-small btn-outline" onClick={() => setUser(null)}>Log out</button>
                    </div>
                    <div className="content-padding">
                        {activeTab === 'home' && <Dashboard setCurrentSong={setCurrentSong} />}
                        {activeTab === 'search' && <Search setCurrentSong={setCurrentSong} />}
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
