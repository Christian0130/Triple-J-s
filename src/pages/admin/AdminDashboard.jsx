import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Users</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </header>
      <div className="admin-content">
        <aside className="admin-sidebar">
          <h2>Navigation</h2>
          <ul>
            <li>Dashboard Overview</li>
            <li>User Management</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </aside>
        <main className="admin-main">
          <h2>Welcome to the Admin Dashboard</h2>
          <p>Here you can manage users, view reports, and configure settings.</p>
          {/* Add more components or features here */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;