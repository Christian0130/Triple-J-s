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
      <h1>Your Cart</h1>
      {normalizedCartItems.length > 0 ? (
        <ul>
          {normalizedCartItems.map((item) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
