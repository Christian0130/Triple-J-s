import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png'
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  }
  return (
    <div className='adminNavbar'>
      <div className='adminNavbar-left'>
        <div  className='navbar-image-container'>
          <img src={logo} alt="" />
        </div>
      </div>
      <div className='adminNavbar-right'>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/orders">Manage Orders</Link>
        <Link to="/manage-products">Manage Products</Link>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  )
}

export default AdminNavbar
