import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(false); 
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });
    
    // --- ⚡ MOBILE DETECTION LOGIC ⚡ ---
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, isLogin ? { email: formData.email, password: formData.password } : formData);
            setUser(response.data.user);
        } catch (error) {
            alert(error.response?.data?.message || "Auth failed");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            height: '100vh', 
            width: '100vw', 
            background: '#000',
            flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
            overflow: isMobile ? 'auto' : 'hidden'      // Enable scroll on mobile
        }}>
            
            {/* --- HERO SECTION: Only visible if NOT mobile --- */}
            {!isMobile && (
                <div style={{ 
                    flex: 1.2, 
                    background: 'url("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop") center/cover',
                    position: 'relative', 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    padding: '80px'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), #000)' }}></div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h1 style={{ fontSize: '96px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-4px', lineHeight: '0.9' }}>PULSE</h1>
                        <p style={{ fontSize: '24px', color: '#8b5cf6', fontWeight: '700', marginTop: '10px' }}>The heartbeat of modern music.</p>
                    </div>
                </div>
            )}

            {/* --- FORM SECTION: Takes full width on mobile --- */}
            <div style={{ 
                flex: isMobile ? '1' : '0 0 450px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: '#070707', 
                padding: isMobile ? '20px' : '40px', 
                borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.05)',
                minHeight: isMobile ? '100vh' : 'auto'
            }}>
                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: isMobile ? '28px' : '36px', color: '#fff', fontWeight: '900', letterSpacing: '-1px' }}>
                            {isLogin ? 'Welcome Back' : 'Join Pulse'}
                        </h2>
                        <p style={{ color: '#a7a7a7' }}>Sync with the rhythm.</p>
                    </div>

                    {!isLogin && (
                        <>
                            <input name="username" type="text" placeholder="Username" onChange={handleChange} className="auth-input" required />
                            <select name="role" onChange={handleChange} className="auth-input" style={{background: '#121212', cursor: 'pointer', color: '#fff'}}>
                                <option value="user">Listener</option>
                                <option value="artist">Artist</option>
                            </select>
                        </>
                    )}
                    <input name="email" type="email" placeholder="Email address" onChange={handleChange} className="auth-input" required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="auth-input" required />
                    
                    <button type="submit" className="btn" style={{ marginTop: '10px' }}>{isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}</button>
                    
                    <p style={{ textAlign: 'center', marginTop: '24px', color: '#a7a7a7', fontSize: '14px' }}>
                        {isLogin ? "Don't have an account? " : "Already synced up? "}
                        <span 
                            style={{ color: '#8b5cf6', cursor: 'pointer', fontWeight: '800' }} 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Sign up" : "Log in"}
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
