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
            
            {/* Left Side: Cinematic Visual (The part you liked!) */}
            <div style={{ 
                flex: 1.2, /* Takes more space for the impact */
                background: 'url("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop") center/cover',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '80px'
            }} className="mobile-hide">
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3), #000)' }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '84px', fontWeight: '900', color: '#ffffff', letterSpacing: '-4px', margin: 0, lineHeight: 0.9 }}>PULSE</h1>
                    <p style={{ fontSize: '24px', color: '#a78bfa', fontWeight: '700', marginTop: '15px', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                        Experience music like never before.
                    </p>
                </div>
            </div>

            {/* Right Side: Solid Form Container (Fixed Width to prevent collapse) */}
            <div style={{ 
                flex: '0 0 450px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px', 
                background: '#0a0a0a',
                position: 'relative',
                zIndex: 10 
            }}>
                <div style={{ width: '100%' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: '#ffffff' }}>
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p style={{ color: '#a7a7a7', fontSize: '15px' }}>Enter your details to sync with the pulse.</p>
                        </div>
                        
                        {!isLogin && (
                            <>
                                <input name="username" type="text" placeholder="Username" onChange={handleChange} required className="auth-input" />
                                <select 
                                    name="role" 
                                    onChange={handleChange} 
                                    className="auth-input"
                                    style={{ cursor: 'pointer', background: '#121212' }}
                                >
                                    <option value="user">Listener</option>
                                    <option value="artist">Artist</option>
                                </select>
                            </>
                        )}
                        
                        <input name="email" type="email" placeholder="Email address" onChange={handleChange} required className="auth-input" />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="auth-input" />
                        
                        {/* ⚡ GREEN BUTTONS ARE BACK */}
                        <button 
                            type="submit" 
                            className="btn" 
                            style={{ 
                                padding: '18px', 
                                fontSize: '16px', 
                                marginTop: '10px',
                                background: '#1DB954',
                                border: 'none',
                                color: '#fff',
                                fontWeight: '900',
                                borderRadius: '50px',
                                cursor: 'pointer'
                            }}
                        >
                            {isLogin ? 'LOG IN' : 'SIGN UP'}
                        </button>
                        
                        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                            <p style={{ fontSize: '14px', color: '#a7a7a7' }}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <p 
                                style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '16px', 
                                    fontWeight: 'bold', 
                                    color: '#1DB954', /* Green Toggle Text */
                                    marginTop: '8px' 
                                }} 
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign up here" : "Log in instead"}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
