import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import "./orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/admin/orders'); // Adjust the URL based on your backend setup
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/orders/${orderId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert("Order marked as completed!");
  
        // Update the local state for orders to reflect the status change
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.order_id === orderId ? { ...order, status: 'completed' } : order
          )
        );
  
        handleCloseModal(); // Close the modal if needed
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      alert("There was an error. Please try again.");
    }
  };

    // Function to open modal with selected order's items
    const handleViewItems = (order) => {
      setSelectedOrder(order);
    };
  
    // Function to close modal
    const handleCloseModal = () => {
      setSelectedOrder(null);
    };

    return (
      <div>
        <div className='orders-top'>
          <h1>Orders</h1>
          <div className="radio-inputs">
              <label className="radio">
                  <input type="radio" name="radio"/>
                  <span className="name">Default</span>
                </label>
                <label className="radio">
                  <input type="radio" name="radio"/>
                  <span className="name">Pending</span>
                </label>
                    
                <label className="radio">
                  <input type="radio" name="radio"/>
                  <span className="name">Completed</span>
                </label>
          </div>
        </div>
        <div className='table-container'>
        <table className='fl-table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.user_name}</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>₱{order.total_amount.toFixed(2)}</td>
                <td><button onClick={() => handleViewItems(order)}>View Items</button></td>
              </tr>  
            ))}
          </tbody>
        </table>
        </div>
  
        {selectedOrder && (
          <Modal onClose={handleCloseModal}>
            <h4>Items:</h4>
            {selectedOrder.items.split(',').map((item) => {
              const [productId, quantity, price] = item.split(':');
              return (
                <div key={productId} className="order-item">
                  <p>Product ID: {productId}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Price per item: ₱{parseFloat(price).toFixed(2)}</p>
                </div>
              );
            })}
            <button onClick={() => handleCompleteOrder(selectedOrder.order_id)}  
            disabled={selectedOrder.status === 'completed'}
            style={{
              cursor: selectedOrder.status === 'completed' ? 'not-allowed' : 'pointer',
              opacity: selectedOrder.status === 'completed' ? 0.5 : 1
            }}>Complete Order</button>
          </Modal>
        )}
      </div>
    );
};

export default Orders;
