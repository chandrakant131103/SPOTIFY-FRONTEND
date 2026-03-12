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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.2), #000)' }}></div>
                <div style={{ position: 'absolute', bottom: '100px', left: '60px', zIndex: 2 }}>
                    <h1 style={{ fontSize: '72px', fontWeight: '900', color: '#fff', letterSpacing: '-3px', margin: 0 }}>PULSE</h1>
                    <p style={{ fontSize: '20px', color: '#8b5cf6', fontWeight: '600', marginTop: '10px' }}>Experience music like never before.</p>
                </div>
            </div>

            {/* Right Side: Glass Form */}
            <div style={{ flex: '0 0 480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: '#000' }}>
                <form className="form-box" onSubmit={handleSubmit} style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ color: '#a7a7a7', marginBottom: '32px' }}>Enter your details to sync with the pulse.</p>
                    
                    {!isLogin && (
                        <>
                            <input name="username" type="text" placeholder="Username" onChange={handleChange} required style={{ marginBottom: '16px' }} />
                            <select name="role" onChange={handleChange} style={{ marginBottom: '16px', width: '100%', padding: '14px', borderRadius: '4px', background: '#121212', color: 'white', border: '1px solid #333' }}>
                                <option value="user">Listener</option>
                                <option value="artist">Artist</option>
                            </select>
                        </>
                    )}
                    
                    <input name="email" type="email" placeholder="Email address" onChange={handleChange} required style={{ marginBottom: '16px' }} />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ marginBottom: '16px' }} />
                    
                    <button type="submit" className="btn" style={{ marginTop: '10px', width: '100%', padding: '16px', fontSize: '16px' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #222' }}>
                        <p style={{ fontSize: '14px', color: '#a7a7a7' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <p 
                            style={{ cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', color: '#8b5cf6', marginTop: '8px' }} 
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
