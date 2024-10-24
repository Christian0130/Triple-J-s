import React, { useContext } from 'react'
import './Navbar.css'
import '../App.css'
import { ShopContext } from '../context/shop-context'
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart } from 'phosphor-react'

const Navbar = () => {
  const navigate = useNavigate();
  const { saveCartToDatabase } = useContext(ShopContext);

  const handleLogout = async () => {
    const userId = localStorage.getItem('userId');

    // Save the user's cart to the database on logout
    await saveCartToDatabase(userId);

    // Clear localStorage and redirect to the login page
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
};

  return (
    <div className='navbar'>
      <div className="links">
        <Link to="/"> Shop </Link>
        <Link to={"/cart"}>
        <ShoppingCart size={32}/>
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
