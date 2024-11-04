import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [orders, setOrders] = useState([]);

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

  return (
    <div>
      <h2>Orders</h2>
      {orders.length > 0 ? (
        orders.map(order => (
          <div key={order.order_id} className="order">
            <h3>Order ID: {order.order_id}</h3>
            <p>User: {order.user_name}</p>
            <p>Order Date: {new Date(order.order_date).toLocaleString()}</p>
            <p>Status: {order.status}</p>
            <p>Total Amount: ₱{order.total_amount.toFixed(2)}</p>
            <div>
              <h4>Items:</h4>
              {order.items.split(',').map(item => {
                const [productId, quantity, price] = item.split(':');
                return (
                  <div key={productId} className="order-item">
                    <p>Product ID: {productId}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Price per item: ₱{parseFloat(price).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default Orders;
