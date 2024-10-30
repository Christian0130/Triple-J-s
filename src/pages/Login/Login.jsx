import React, { useState, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/shop-context'; // Import your context
import './login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    
    const { setCartItems, products } = useContext(ShopContext); // Access context functions and state

    const fetchCartItems = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/cart/${userId}`);
            const cartData = await response.json();

            // Format fetched data to match state structure
            const updatedCartItems = cartData.map(cartItem => {
                const productDetails = products.find(product => product.id === cartItem.productId);
                return {
                    id: cartItem.productId,
                    name: productDetails ? productDetails.name : "Unknown Product",
                    quantity: cartItem.quantity,
                    userId: userId
                };
            });

            setCartItems(updatedCartItems); // Update cart items in global state
        } catch (err) {
            console.error("Error fetching cart items:", err);
        }
    };
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
                // Save token, userId, and role to local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('role', data.role);
                
                setSuccess("Login successful!");

                // Redirect based on role
                if (data.role === 'admin') {
                    navigate('/admin-dashboard'); // Redirect to admin dashboard
                } else {
                    await fetchCartItems(data.userId); // Fetch cart items for regular users
                    navigate('/'); // Redirect to user homepage
                }
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
