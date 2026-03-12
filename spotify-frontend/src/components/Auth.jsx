import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(false); 
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        // 🔥 This is vital: prevents browser refresh on submit
        e.preventDefault(); 
        
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, isLogin ? { email: formData.email, password: formData.password } : formData);
            
            // Set user to state, which then gets saved to localStorage in App.jsx
            setUser(response.data.user);
        } catch (error) {
            console.error("Authentication Error", error);
            alert(error.response?.data?.message || "Authentication failed. Please try again.");
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000' }}>
            <div style={{ 
                flex: 1.2, background: 'url("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop") center/cover',
                position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '80px'
            }} className="mobile-hide">
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.3), #000)' }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '84px', fontWeight: '900', color: '#ffffff', margin: 0 }}>PULSE</h1>
                    <p style={{ fontSize: '24px', color: '#a78bfa', fontWeight: '700' }}>Experience music like never before.</p>
                </div>
            </div>

            <div style={{ flex: '0 0 450px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '40px' }}>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 style={{ fontSize: '32px', color: '#fff' }}>{isLogin ? 'Log In' : 'Create Account'}</h2>
                    {!isLogin && (
                        <>
                            <input name="username" type="text" placeholder="Username" onChange={handleChange} className="auth-input" required />
                            <select name="role" onChange={handleChange} className="auth-input" style={{background: '#121212', cursor: 'pointer'}}>
                                <option value="user">Listener</option>
                                <option value="artist">Artist</option>
                            </select>
                        </>
                    )}
                    <input name="email" type="email" placeholder="Email address" onChange={handleChange} className="auth-input" required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="auth-input" required />
                    <button type="submit" className="btn" style={{ background: '#1DB954', marginTop: '10px' }}>{isLogin ? 'LOG IN' : 'SIGN UP'}</button>
                    <p 
                        style={{ textAlign: 'center', marginTop: '20px', color: '#1DB954', cursor: 'pointer', fontWeight: 'bold' }} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign up here" : "Log in instead"}
                    </p>
                </form>
            </div>
        </div>
    );
}
