import React, { useContext } from 'react';
import { ShopContext } from '../../context/shop-context';
import "../cart/cart.css";

const Cart = () => {
  const { cartItems, products } = useContext(ShopContext);

  console.log('Cart Items:', cartItems);
  console.log('Products:', products);

  if (cartItems.length === 0 || products.length === 0) {
    return <p className='cart-message'>Your cart is empty</p>; // Handle empty case if data isn't ready
  }

  const normalizedCartItems = cartItems.map(cartItem => {
    const product = products.find(p => String(p.id) === String(cartItem.id)); // Ensure the IDs match
    return product ? { ...product, quantity: cartItem.quantity } : null; // Merge product info with cart quantity
  }).filter(item => item !== null); // Filter out any invalid products

  return (
    <div>
      <h1 className='cart'>Your Cart</h1>
      {normalizedCartItems.length > 0 ? (
      <div className='cart-container'>
        <div className='cart-left'>
          {normalizedCartItems.map((item) => (
            <div key={item.id} className='cart-item'>
              <p>{item.name}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <button>Remove</button>
            </div>
          ))}
        </div>
        <div className='cart-right'>
          
        </div>
      </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
