import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    // Default to Sign Up screen
    const [isLogin, setIsLogin] = useState(false); 
    const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'user' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin 
                ? { email: formData.email, password: formData.password } 
                : formData;
            
            const response = await api.post(endpoint, payload);
            setUser(response.data.user);
        } catch (error) {
            alert(error.response?.data?.message || "Authentication failed");
        }
    };

    return (
        <div className="auth-container" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            background: 'transparent' 
        }}>
            <form className="form-box" onSubmit={handleSubmit} style={{ 
                width: '100%', 
                maxWidth: '420px', 
                padding: '40px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                position: 'relative',
                zIndex: 100 /* Ensures form stays on top of any background images */
            }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff' }}>PULSE</h1>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>
                        {isLogin ? 'Log In to Listen' : 'Create Account'}
                    </h2>
                </div>
                
                {!isLogin && (
                    <>
                        <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
                        <select 
                            name="role" 
                            onChange={handleChange} 
                            style={{ 
                                padding: '14px', 
                                borderRadius: '4px', 
                                border: '1px solid #727272', 
                                backgroundColor: 'rgba(0,0,0,0.4)', 
                                color: 'white', 
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="user" style={{ color: 'black' }}>Listener</option>
                            <option value="artist" style={{ color: 'black' }}>Artist</option>
                        </select>
                    </>
                )}
                
                <input name="email" type="email" placeholder="Email address" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                
                <button 
                    type="submit" 
                    className="btn" 
                    style={{ 
                        marginTop: '10px', 
                        background: '#1DB954', /* Green Button */
                        color: '#fff',
                        fontWeight: '800'
                    }}
                >
                    {isLogin ? 'LOG IN' : 'SIGN UP'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '20px', borderTop: '1px solid #282828' }}>
                    <p style={{ fontSize: '14px', color: '#a7a7a7' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <p 
                        style={{ 
                            cursor: 'pointer', 
                            fontSize: '15px', 
                            fontWeight: 'bold', 
                            color: '#1DB954', 
                            marginTop: '8px' 
                        }} 
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign up for Pulse" : "Log in instead"}
                    </p>
                </div>
            </form>
        </div>
    );
}
