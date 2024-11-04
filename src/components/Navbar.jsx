import React, { useContext } from 'react'
import './Navbar.css'
import '../App.css'
import { ShopContext } from '../context/shop-context'
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from 'phosphor-react'

const Navbar = () => {
  const navigate = useNavigate();
  const { saveCartToDatabase } = useContext(ShopContext);
  const userName = localStorage.getItem('name');

  console.log(`User Name is: ${userName}`)

  const handleLogout = async () => {
    // const userId = localStorage.getItem('userId');

    // // Save the user's cart to the database on logout
    // await saveCartToDatabase(userId);

    // // Clear localStorage and redirect to the login page
    // localStorage.removeItem('token');
    // localStorage.removeItem('userId');
    const userId = localStorage.getItem('userId'); // Get the user ID

    if (userId) {
        // Call the API to save the cart items to the database
        await saveCartToDatabase(userId);
    }

    // Clear user ID and cart items from local storage and state
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    // Optionally redirect the user or show a success message
    console.log("User logged out successfully");
    // Redirect or show message
    navigate('/login');
};

  return (
    <div className='navbar'>
        <div className="left-side-links">
          <Link to="/"> Shop </Link>
        </div>
        <div className="right-side-links">
          <Link to={"/cart"}>
          <ShoppingCart size={32}/>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar
