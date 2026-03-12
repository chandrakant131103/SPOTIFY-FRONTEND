import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    const [isLogin, setIsLogin] = useState(false); 
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents page reload
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, isLogin ? { email: formData.email, password: formData.password } : formData);
            setUser(response.data.user);
        } catch (error) {
            alert(error.response?.data?.message || "Authentication failed. Please check your details.");
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#000' }}>
            
            {/* --- LEFT SIDE: Cinematic Visual (Hides on Mobile) --- */}
            <div style={{ 
                flex: 1.2, 
                background: 'url("https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop") center/cover',
                position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '80px'
            }} className="mobile-hide">
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), #000)' }}></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontSize: '96px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '-4px', lineHeight: '0.9' }}>PULSE</h1>
                    <p style={{ fontSize: '24px', color: '#8b5cf6', fontWeight: '700', marginTop: '10px' }}>The heartbeat of modern music.</p>
                </div>
            </div>

            {/* --- RIGHT SIDE: Auth Form (Adapts to Mobile) --- */}
            <div style={{ 
                flex: '1', /* Allows it to shrink and fill mobile screens */
                maxWidth: '450px', /* Keeps it neat on desktop */
                width: '100%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                background: '#070707', padding: '40px', 
                borderLeft: '1px solid rgba(255,255,255,0.05)' 
            }}>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '36px', color: '#fff', fontWeight: '900', letterSpacing: '-1px' }}>
                            {isLogin ? 'Welcome Back' : 'Join Pulse'}
                        </h2>
                        <p style={{ color: '#a7a7a7' }}>Sync with the rhythm.</p>
                    </div>

                    {!isLogin && (
                        <>
                            <input name="username" type="text" placeholder="Username" onChange={handleChange} className="auth-input" required />
                            <select name="role" onChange={handleChange} className="auth-input" style={{ cursor: 'pointer' }}>
                                <option value="user">Listener</option>
                                <option
