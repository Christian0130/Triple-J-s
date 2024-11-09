import './App.css';  
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Shop from './pages/shop/Shop';
import Cart from './pages/cart/Cart';
import { ShopContextProvider } from './context/shop-context';
import Login from './pages/Login/Login';
import Registration from './pages/Register/Registration';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNavbar from './components/AdminNavbar';
import Orders from './pages/orders/Orders';
import ManageProducts from './pages/manageProducts/ManageProducts';

function App() {
  const location = useLocation(); // Access the current route
  const role = localStorage.getItem('role');
  const noNavbarPaths = ['/login', '/register'];
  console.log(role);

  const renderNavbar = () => {
    if (noNavbarPaths.includes(location.pathname)) {
      return null;
    } else if (role  === null) {
      return <Navbar />;
    } else if (role === 'user') {
      return <Navbar />;
    } else {
      return <AdminNavbar />;
    }
  };

  return (
    <div className="app">
      <ShopContextProvider>
        {/* Conditionally render Navbar based on the route */}
        {renderNavbar()}
        
        <Routes>
          <Route path="/" element={<Navigate to="/shop" />} /> {/* Redirect root to Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/orders" element={<Orders />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Add a NotFound route if needed */}
        </Routes>
      </ShopContextProvider>
    </div>
  );
}

// AppWrapper wraps App with Router to provide context for useLocation()
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
