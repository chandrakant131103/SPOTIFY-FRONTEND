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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.5), #000)' }}></div>
                <div style={{ position: 'absolute', bottom: '100px', left: '60px', zIndex: 2 }}>
                    <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#ffffff', letterSpacing: '-3px', margin: 0 }}>PULSE</h1>
                    <p style={{ fontSize: '22px', color: '#a78bfa', fontWeight: '700', marginTop: '10px' }}>
                        Experience music like never before.
                    </p>
                </div>
            </div>

            {/* Right Side: Fixed Form Container */}
            <div style={{ 
                flex: '0 0 500px', /* Increased width to prevent collapse */
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '60px', 
                background: '#070707',
                zIndex: 10 
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '8px', color: '#ffffff' }}>
                                {isLogin ? 'Log In' : 'Create Account'}
                            </h2>
                            <p style={{ color: '#a7a7a7', fontSize: '16px' }}>Enter your details to sync with the pulse.</p>
                        </div>
                        
                        {!isLogin && (
                            <>
                                <input name="username" type="text" placeholder="Username" onChange={handleChange} required className="auth-input" />
                                <select 
                                    name="role" 
                                    onChange={handleChange} 
                                    className="auth-input"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <option value="user">Listener</option>
                                    <option value="artist">Artist</option>
                                </select>
                            </>
                        )}
                        
                        <input name="email" type="email" placeholder="Email address" onChange={handleChange} required className="auth-input" />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="auth-input" />
                        
                        <button type="submit" className="btn" style={{ padding: '18px', fontSize: '18px', marginTop: '10px' }}>
                            {isLogin ? 'LOG IN' : 'SIGN UP'}
                        </button>
                        
                        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                            <p style={{ fontSize: '14px', color: '#a7a7a7', marginBottom: '10px' }}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <p 
                                style={{ cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', color: '#1DB954' }} 
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
