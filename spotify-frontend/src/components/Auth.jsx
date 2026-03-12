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
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            background: '#000',
            backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)'
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '40px', 
                background: 'rgba(18, 18, 18, 0.8)', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', letterSpacing: '-1.5px', marginBottom: '8px' }}>
                        PULSE
                    </h1>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="Username" 
                                onChange={handleChange} 
                                required 
                                className="auth-input" 
                            />
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
                    
                    <button 
                        type="submit" 
                        className="btn" 
                        style={{ 
                            padding: '16px', 
                            fontSize: '16px', 
                            marginTop: '12px',
                            background: '#1DB954',
                            color: '#fff',
                            borderRadius: '50px',
                            border: 'none',
                            fontWeight: '800'
                        }}
                    >
                        {isLogin ? 'LOG IN' : 'SIGN UP'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '14px', color: '#a7a7a7', marginBottom: '8px' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#1DB954', 
                            fontWeight: '700', 
                            fontSize: '15px', 
                            cursor: 'pointer' 
                        }}
                    >
                        {isLogin ? "Sign up for Pulse" : "Log in instead"}
                    </button>
                </div>
            </div>
        </div>
    );
}
