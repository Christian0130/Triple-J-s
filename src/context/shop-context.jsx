import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8081/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.log(err))
    }, [])

    // const addToCart = (product) => {
    //     setCartItems((prevCart) => {
    //         const productId = product.id;
    //         const existingProduct = prevCart[productId];
    
    //         // Determine new quantity
    //         const newQuantity = existingProduct ? existingProduct.productQuantity + 1 : 1;
    
    //         // Update the cart state
    //         const updatedCart = {
    //             ...prevCart,
    //             [productId]: {
    //                 productId: product.id,
    //                 productName: product.name,
    //                 productQuantity: newQuantity,
    //             },
    //         };
    
    //         // Only make the API call if the product was not previously in the cart
    //         if (!existingProduct) {
    //             fetch('http://localhost:8081/add-to-cart', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     productId: product.id,
    //                     productName: product.name,
    //                     productQuantity: newQuantity,
    //                 }),
    //             })
    //             .then(res => res.json())
    //             .then(data => console.log(data))
    //             .catch(err => console.log(err));
    //         }
    
    //         return updatedCart;
    //     });
    // };

    const addToCart = (product, quantity) => {
      const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
      if (!userId) {
        console.error('User not logged in');
        navigate('/login');
        window.alert("Please Log in");
        return;
      }
    
      setCartItems((prevCart) => {
        // Find if the product is already in the cart
        const existingItem = prevCart.find((item) => item.id === product.id);
    
        // Check if the product quantity to add is valid
        if (quantity > product.quantity) {
          alert(`Only ${product.quantity} units of ${product.name} are available.`);
          return prevCart;  // Return the previous cart, no update if quantity exceeds available stock
        }
    
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity; // Add the user-inputted quantity to the existing quantity
    
          // Prevent adding more products than available
          if (newQuantity > product.quantity) {
            alert(`Only ${product.quantity} units of ${product.name} are available.`);
            return prevCart;  // Return previous cart, no update if quantity exceeds
          }
    
          // Update cart quantity
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }
    
        // If not in the cart, add the product with the user-specified quantity
        return [...prevCart, { ...product, quantity }];
      });
    };
    
      

    const saveCartToDatabase = async (userId) => {
        try {
            await fetch(`http://localhost:8081/api/cart/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems }),
            });
            console.log("Cart saved to database successfully");
        } catch (err) {
            console.error("Error saving cart to database:", err);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems((prevCartItems) => {
            return prevCartItems.filter(item => item.id !== productId)
        });
    }

    const clearCart = () => {
        setCartItems([]); // Clears all items in the cart
    };

    return (
    <ShopContext.Provider value={{cartItems, products, addToCart, saveCartToDatabase, setCartItems, removeFromCart, clearCart}}>
      {props.children}
    </ShopContext.Provider>
  )
}