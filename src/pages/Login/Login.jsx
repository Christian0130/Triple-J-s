import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import useNavigate
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try { 
            const response = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle successful login (e.g., store token, redirect, etc.)
                localStorage.setItem('token', data.token); // Store token in local storage
                localStorage.setItem('userId', data.userId);
                setSuccess("Login successful!"); // Optional success message
                // You can also redirect to a protected route or dashboard here
                navigate('/');
            } else {
                throw new Error(data); // Handle errors
            }
        } catch (err) {
            setError(err.message); // Set error message
        }
    };

    return (
        <>
        <div className='loginContainer'>
            <h1>Login to your Account</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleLogin}>
                    <input
                        placeholder='Username'
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        placeholder='Password'
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                
                <button type="submit">Login</button>
            </form>
            <Link to={'/register'} className='link'>Register</Link>
        </div>
        </>
    );
};

export default Login;
