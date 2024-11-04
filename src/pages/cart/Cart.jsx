import React, { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import { MapPin, IdentificationBadge } from 'phosphor-react'
import "../cart/cart.css";

const Cart = () => {
  const { cartItems, products, removeFromCart, clearCart } = useContext(ShopContext);
  const name = localStorage.getItem("name");
  const address = localStorage.getItem("address");

  console.log(`delivery info:  ${name} ${address}`);
  console.log('Cart Items:', cartItems);
  console.log('Products:', products);

  if (cartItems.length === 0 || products.length === 0) {
    return <p className='cart-message'>Your cart is empty</p>; // Handle empty case if data isn't ready
  }

  const normalizedCartItems = cartItems.map(cartItem => {
    const product = products.find(p => String(p.id) === String(cartItem.id)); // Ensure the IDs match
    return product ? { ...product, quantity: cartItem.quantity } : null; // Merge product info with cart quantity
  }).filter(item => item !== null); // Filter out any invalid products

  const subtotal = normalizedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 60; // Example flat shipping rate
  const tax = subtotal * 0.1; // Example tax rate at 10%
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    const userId = localStorage.getItem('userId'); // Assuming the userId is stored in localStorage
    const cartItems = normalizedCartItems; // Use the items from your context or cart state
    const totalAmount = total;

    try {
        const response = await fetch(`http://localhost:8081/api/place-order/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItems, totalAmount }),
        });

        if (response.ok) {
            const data = await response.json();
            alert("Order placed successfully!");
            // Optionally, clear cart items in ShopContext here
            // Clear the cart in ShopContext after order is placed
            clearCart();
        } else {
            const error = await response.json();
            alert(`Failed to place order: ${error.message}`);
        }
    } catch (error) {
        console.error("Error placing order:", error);
    }
  };


  return (
    <div>
      <h1 className='cart'>Your Cart</h1>
      {normalizedCartItems.length > 0 ? (
      <div className='cart-container'>
        <div className='cart-left'>
        <div className="cart-information">
          <p>Delivery Information</p>
          <div className="name">
            <IdentificationBadge size={32} />
            <p>{name}</p>
          </div>
          <div className="address">
            <MapPin size={32} />
            <p>{address}</p>
          </div>
        </div>
        <p className='products-ordered'>Products Ordered</p>
          {normalizedCartItems.map((item) => (
            <div key={item.id} className='cart-item'>
              <p className='item-name'>{item.name}</p>
              <p>Price: ₱{item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="span">
                <p>Item Subtotal: ₱{item.price * item.quantity}</p>
                <button onClick={() => {removeFromCart(item.id)}}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        
          <div className='cart-right'>
            <div className='cart-top'>
              <p>Cart Total</p>
            </div>
            <div className='cart-bottom'>
              <div>
                <p>Subtotal:</p>
                <p>₱{subtotal.toFixed(2)}</p>
              </div>
              <div>
                <p>Shipping:</p>
                <p>₱{shipping.toFixed(2)}</p>
              </div>
              <div>
                <p>Tax:</p>
                <p>₱{tax.toFixed(2)}</p>
              </div>
              <div>
                <p>Total:</p>
                <p>₱{total.toFixed(2)}</p>
              </div>
              <div className='payment'>
                <div className="payment-method">
                  <p>Payment Method</p>
                  <p>cash on delivery</p>
                </div>
                <button onClick={handlePlaceOrder}>Place Order</button>
              </div>
            </div>
          </div>
        
      </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
