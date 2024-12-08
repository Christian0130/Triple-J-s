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

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/orders'); // Adjust the URL based on your backend setup
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/orders/pending'); // Adjust the URL based on your backend setup
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchCompletedOrders = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/orders/completed'); // Adjust the URL based on your backend setup
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:8081/api/orders/${orderId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert("Order marked as completed! Product quantities have been updated.");

            // Update the local state for orders to reflect the status change
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.order_id === orderId ? { ...order, status: 'completed' } : order
                )
            );

            handleCloseModal(); // Close the modal if needed
        } else {
            alert("Failed to complete the order.");
        }
    } catch (error) {
        console.error("Error completing order:", error);
        alert("There was an error. Please try again.");
    }
};

const createWalkInOrder = async (customerName, selectedProducts) => {
  try {
      const response = await fetch('http://localhost:8081/api/walk-in-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerName, products: selectedProducts })
      });

      if (response.ok) {
          const data = await response.json();
          console.log('Order created successfully:', data);
          // Update orders page to reflect the new order
      } else {
          console.error('Failed to create order:', await response.json());
      }
  } catch (error) {
      console.error('Error creating walk-in order:', error);
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
        <h1 className='orders-manager'>Orders</h1>
        <div className='radio-inputs-container'>
          <div className="radio-inputs">
            <button onClick={() => fetchOrders()}>Default</button>
            <button onClick={() => fetchPendingOrders()}>pending</button>
            <button onClick={() => fetchCompletedOrders()}>Completed</button>
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
                <td><button className='viewItemsbutton' onClick={() => handleViewItems(order)}>View Items</button></td>
              </tr>  
            ))}
          </tbody>
        </table>
        </div>
  
        {selectedOrder && (
          <Modal onClose={handleCloseModal}>
            <h4>Items:</h4>
            {selectedOrder.items.split(',').map((item) => {
              const [productId, quantity, price, productName] = item.split(':');
              console.log("Items field:", selectedOrder.items);
              console.log("Split items:", selectedOrder.items.split(','));

              return (
                <div key={productId} className="order-item">
                  <p>Product ID: {productId}</p>
                  <p>Product Name: {productName}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Price per item: ₱{parseFloat(price).toFixed(2)}</p>
                </div>
              );
            })}
            <button className='completeOrderButton' onClick={() => handleCompleteOrder(selectedOrder.order_id)}  
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
