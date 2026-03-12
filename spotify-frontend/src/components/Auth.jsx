import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(false); 
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
            const response = await api.post(endpoint, payload);
            setUser(response.data.user);
        } catch (error) {
            alert(error.response?.data?.message || "Authentication failed");
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000', overflow: 'hidden' }}>
            
            {/* Left Side: Cinematic Visual */}
            <div style={{ 
                flex: 1, 
                background: 'url("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop") center/cover',
                position: 'relative'
            }} className="mobile-hide">
                {/* Darker Overlay for better text visibility */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), #000)' }}></div>
                
                <div style={{ position: 'absolute', bottom: '100px', left: '60px', zIndex: 2 }}>
                    <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#ffffff', letterSpacing: '-3px', margin: 0 }}>PULSE</h1>
                    {/* Fixed visibility: High contrast Violet and Shadow */}
                    <p style={{ 
                        fontSize: '22px', 
                        color: '#a78bfa', 
                        fontWeight: '700', 
                        marginTop: '10px',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)' 
                    }}>
                        Experience music like never before.
                    </p>
                </div>
            </div>

            {/* Right Side: Form Container */}
            <div style={{ 
                flex: '0 0 480px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px', 
                background: '#000',
                position: 'relative',
                zIndex: 10 // Ensures this side is on top of any abstract background blurs
            }}>
                <form className="form-box" onSubmit={handleSubmit} style={{ background: 'transparent', border: 'none', boxShadow: 'none', width: '100%' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: '#a7a7a7', marginBottom: '32px' }}>Enter your details to sync with the pulse.</p>
                    
                    {!isLogin && (
                        <>
                            <input name="username" type="text" placeholder="Username" onChange={handleChange} required style={{ marginBottom: '16px', width: '100%' }} />
                            <select 
                                name="role" 
                                onChange={handleChange} 
                                style={{ 
                                    marginBottom: '16px', 
                                    width: '100%', 
                                    padding: '14px', 
                                    borderRadius: '4px', 
                                    background: '#121212', 
                                    color: 'white', 
                                    border: '1px solid #333',
                                    cursor: 'pointer' 
                                }}
                            >
                                <option value="user">Listener</option>
                                <option value="artist">Artist</option>
                            </select>
                        </>
                    )}
                    
                    <input name="email" type="email" placeholder="Email address" onChange={handleChange} required style={{ marginBottom: '16px', width: '100%' }} />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ marginBottom: '16px', width: '100%' }} />
                    
                    {/* Explicit Button Cursor and Z-Index */}
                    <button 
                        type="submit" 
                        className="btn" 
                        style={{ 
                            marginTop: '10px', 
                            width: '100%', 
                            padding: '16px', 
                            fontSize: '16px', 
                            cursor: 'pointer',
                            position: 'relative',
                            zIndex: 20,
                            background: '#8b5cf6',
                            color: '#fff'
                        }}
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                        <p style={{ fontSize: '14px', color: '#a7a7a7' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <p 
                            style={{ 
                                cursor: 'pointer', 
                                fontSize: '15px', 
                                fontWeight: 'bold', 
                                color: '#8b5cf6', 
                                marginTop: '8px',
                                position: 'relative',
                                zIndex: 20 
                            }} 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? "Create one now" : "Log in instead"}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
