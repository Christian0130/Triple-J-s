import './App.css'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Shop from './pages/shop/shop';
import Cart from './pages/cart/cart';
import { ShopContextProvider } from './context/shop-context';
import Login from './pages/Login/Login';
import Registration from './pages/Register/Registration';

function App() {
  const location = useLocation(); // Access the current route

  return (
    <div className="app">
      <ShopContextProvider>
        {/* Conditionally render Navbar based on the route */}
        {location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
        
        <Routes>
          <Route path='/register' element={<Registration />} />
          <Route path='/' element={<Shop />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} /> {/* Login Route */}
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
