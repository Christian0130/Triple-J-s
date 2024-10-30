import './App.css'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Shop from './pages/shop/shop';
import Cart from './pages/cart/Cart';
import { ShopContextProvider } from './context/shop-context';
import Login from './pages/Login/Login';
import Registration from './pages/Register/Registration';
import AdminDashboard from './pages/admin/adminDashboard';

function App() {
  const location = useLocation(); // Access the current route
   // Define an array of paths where the Navbar should not be displayed
  const noNavbarPaths = ['/login', '/register', '/admin-dashboard'];

  return (
    <div className="app">
      <ShopContextProvider>
        {/* Conditionally render Navbar based on the route */}
        {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
                {/* Conditionally render Navbar based on the route */}
                {/* {!noNavbarPaths.includes(location.pathname) && <Navbar />} */}
        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/' element={<Shop />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} /> {/* Login Route */}
          {/* Admin Dashboard Route - Only accessible if role is 'admin' */}
          <Route 
            // path='/admin-dashboard' 
            // element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
            path='/admin-dashboard' element={<AdminDashboard/>}
          />
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
