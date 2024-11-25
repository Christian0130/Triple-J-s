import React from 'react';
import { Users, ChartLine, ClockClockwise, CheckCircle } from 'phosphor-react';
import { useEffect, useState } from 'react';
import moment from 'moment';  // Import moment.js
import './adminDashboard.css';
import SalesTrendChart from './SalesTrendChart';
import { v4 as uuidv4 } from 'uuid';

const drawerWidth = 240;

const AdminDashboard = () => {

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState({});
  const [salesTrend, setSalesTrend] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  
  const fetchTotalSales = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/total-sales');
        const data = await response.json();
        resolve(data.totalSales || 0);
      } catch (error) {
        console.error("Error fetching total sales:", error);
        reject(error);
      }
    });
  };
  
  const fetchTotalProducts = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/total-products');
        const data = await response.json();
        resolve(data.totalProducts || 0);
      } catch (error) {
        console.error("Error fetching total products:", error);
        reject(error);
      }
    });
  };
  

  const fetchTotalOrders = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/total-orders');
        const data = await response.json();
        resolve(data.totalOrders || 0);
      } catch (error) {
        console.error("Error fetching total orders:", error);
        reject(error);
      }
    });
  };

  const fetchPendingOrders = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/total-orders-pending');
        const data = await response.json();
        resolve(data.totalOrders || 0);
      } catch (error) {
        console.error("Error fetching total orders:", error);
        reject(error);
      }
    });
  };

  const fetchTopProducts = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/top-products');
        const data = await response.json();
        resolve(data || []); // Resolve with an empty array in case of no data
      } catch (error) {
        console.error("Error fetching top products:", error);
        reject(error);
      }
    });
  };

  const fetchTotalCustomers = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/total-customers');
        const data = await response.json();
        resolve(data.totalCustomers || 0);
      } catch (error) {
        console.error("Error fetching total customers:", error);
        reject(error);
      }
    });
  };

  const fetchSalesTrend = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('http://localhost:8081/api/dashboard/sales-trend');
        const data = await response.json();
        resolve(data || []); // Resolve with the data (or an empty array if there's no data)
      } catch (error) {
        console.error("Error fetching sales trend:", error);
        reject(error);
      }
    });
  };

  useEffect(() => {
    fetchTotalSales().then(setTotalSales).catch(console.error);
    fetchTotalOrders().then(setTotalOrders).catch(console.error);
    fetchPendingOrders().then(setPendingOrders).catch(console.error);
    fetchTotalProducts().then(setTotalProducts).catch(console.error);
    fetchTopProducts().then((data) => {
      setTopProducts(data); // Set top products in the state
    }).catch(console.error);
    fetchTotalCustomers().then(setTotalCustomers).catch(console.error);
    fetchSalesTrend().then((data) => {
      // Format the date using moment before setting it in the state
      const formattedData = data.map(item => ({
        ...item,
        date: moment(item.date).format('YYYY-MM-DD')  // Format the date
      }));
      setSalesTrend(formattedData);  // Set the formatted sales trend
    }).catch(console.error);
  }, []);

  console.log(`Active Products: ${totalProducts}`);
  console.log(`Sales Trend: ${salesTrend}`);
  salesTrend.map((item) => {
    console.log(item);
  })
 

  return (
    
    <div className="admin-dashboard">
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
    </header>
    <div className='data-flex'>
      <div className='data-container'>
        <div className='data-icon'>
          <Users size={50} />
        </div>
        <div className="data-title">
          <p className='data-name'>Users</p> 
          <p className='data'>{totalCustomers}</p>
        </div>
      </div>
      <div className='data-container'>
        <div className='data-icon'>
        <ChartLine size={50} /> 
        </div>
        <div className="data-title">
          <p className='data-name'>Total Sales</p> 
          <p className='data'>₱{totalSales}</p>
        </div>
      </div>
      <div className='data-container'>
        <div className='data-icon'>
        <ClockClockwise size={50} />
        </div>
        <div className="data-title">
          <p className='data-name'>Pending Orders</p> 
          <p className='data'>{pendingOrders}</p>
        </div>
      </div>
      <div className='data-container'>
        <div className='data-icon'>
        <CheckCircle size={50} />
        </div>
        <div className="data-title">
          <p className='data-name'>Completed Orders</p> 
          <p className='data'>{totalOrders}</p>
        </div>
      </div>
      {/* <div className='data-container'>
        <div className="data-title">
          <p className='data-name'>Total Sales</p>
          <ChartLine size={35} />  
        </div>
        <p className='data'>₱{totalSales}</p>
      </div>
      <div className='data-container'>
        <div className="data-title">
          <p className='data-name'>Pending Orders</p>
          <ClockClockwise size={35} />
        </div>
        <p className='data'>{pendingOrders}</p>
      </div>
      <div className='data-container'>
        <div className="data-title">
          <p className='data-name'>Completed Orders</p>
          <CheckCircle size={35} />
        </div>
        <p className='data'>{totalOrders}</p>
      </div> */}
    </div>

    <div className='topProducts-table-container'>
      <h3>Top Products</h3>
      <table className='fl-table'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Items Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((product) => (
            <tr key={uuidv4()}>
              <td>{product.name}</td>
              <td>{product.totalSold}</td>
              <td>${product.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className='topProducts-table-container'>
    <SalesTrendChart salesTrend={salesTrend} />
    </div>

    {/* <h2>Sales Trend</h2>
    <ul>
      {salesTrend.map((item, index) => (
        <li key={Math.random()}>
          Date: {item.date}, Daily Sales: {item.dailySales}
        </li>
      ))}
    </ul> */}

  </div>
  );
};

export default AdminDashboard;
