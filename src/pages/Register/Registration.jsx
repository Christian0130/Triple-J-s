import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import useNavigate
import "./register.css"
import logo from '../../images/logo.png'

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8081/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, fullname, address }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            setSuccess(data.message || 'Registration successful! Please log in.');
            setUsername('');
            setPassword('');
            setFullname('');
            setAddress('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
        <div className='registrationPage'>
            <div className='registration-image-container'>
                <img src={logo} alt="" />
            </div>
            <div className="registration">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div>
                        <input
                            placeholder='Username'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                        placeholder='Password'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>               
                     <div>
                        <input
                        placeholder='Full Name'
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            placeholder='Delivery Address'
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <Link className='link' to={'/login'}>Login</Link>
            </div>
        </div>
        </>
    );
};

export default Registration;
