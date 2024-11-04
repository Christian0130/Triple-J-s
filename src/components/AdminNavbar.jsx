import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  }
  return (
    <div className='adminNavbar'>
      <div className='adminNavbar-left'>
        <p>Triple J's</p>
      </div>
      <div className='adminNavbar-right'>
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/manage-users">Manage Users</Link>
        <Link to="/admin-reports">Reports</Link>
        <button onClick={handleLogout}>logout</button>
      </div>
    </div>
  )
}

export default AdminNavbar
