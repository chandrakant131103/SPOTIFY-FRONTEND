import React, { useState } from 'react';
import api from '../api/axiosConfig';

export default function Auth({ setUser }) {
    // 1. We change this to 'false' so Sign Up is the default screen
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
        <div className="auth-container">
            <form className="form-box" onSubmit={handleSubmit}>
                <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                    {isLogin ? 'Log In to Listen' : 'Create an Account'}
                </h2>
                
                {/* 2. These fields show by default now because isLogin is false */}
                {!isLogin && (
                    <>
                        <input name="username" type="text" placeholder="Username" onChange={handleChange} required />
                        <select name="role" onChange={handleChange} style={{ padding: '14px', borderRadius: '4px', border: '1px solid #727272', backgroundColor: 'transparent', color: 'white', fontSize: '16px' }}>
                            <option value="user" style={{ color: 'black' }}>Listener</option>
                            <option value="artist" style={{ color: 'black' }}>Artist</option>
                        </select>
                    </>
                )}
                
                <input name="email" type="email" placeholder="Email address" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                
                <button type="submit" className="btn" style={{ marginTop: '10px' }}>
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
                
                {/* 3. Polished toggle section */}
                <div style={{ textAlign: 'center', marginTop: '15px', paddingTop: '20px', borderTop: '1px solid #282828' }}>
                    <p style={{ fontSize: '14px', color: '#a7a7a7' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <p 
                        style={{ cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', color: '#ffffff', marginTop: '8px', transition: 'color 0.2s' }} 
                        onClick={() => setIsLogin(!isLogin)}
                        onMouseOver={(e) => e.target.style.color = '#1DB954'}
                        onMouseOut={(e) => e.target.style.color = '#ffffff'}
                    >
                        {isLogin ? "Sign up here" : "Log in instead"}
                    </p>
                </div>
            </form>
        </div>
    );
}