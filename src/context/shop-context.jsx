import React, { createContext, useState, useEffect } from 'react'

export const ShopContext = createContext();

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);

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

    const addToCart = (product) => {
        const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
    
        if (!userId) {
            console.error('User not logged in');
            return;
        }
    
        setCartItems((prevCartItems) => {
            const existingProduct = prevCartItems.find(item => item.id === product.id);
    
            if (existingProduct) {
                return prevCartItems.map(item =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                );
            } else {
                // Add the product to the cart for this user
                return [...prevCartItems, { id: product.id, name: product.name, quantity: 1, userId }];
            }
        });
    };
    

    //   const addToCart = (product) => {
//     setCartItems((prevCart) => {
//       const existingProduct = prevCart.find((item) => item.productId === product.id);

//       if (existingProduct) {
//         const updatedCart = prevCart.map((item) =>
//           item.productId === product.id
//             ? { ...item, productQuantity: item.productQuantity + 1 }
//             : item
//         );

//         // Save the updated cart item to the database
//         fetch('http://localhost:8081/add-to-cart', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             productId: product.id,
//             productName: product.name,
//             productQuantity: existingProduct.productQuantity + 1,
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => console.log(data))
//           .catch((err) => console.log(err));

//         return updatedCart;
//       } else {
//         const updatedCart = [
//           ...prevCart,
//           {
//             productId: product.id,
//             productName: product.name,
//             productQuantity: 1,
//           },
//         ];

//         // Save the new cart item to the database
//         fetch('http://localhost:8081/add-to-cart', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             productId: product.id,
//             productName: product.name,
//             productQuantity: 1,
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => console.log(data))
//           .catch((err) => console.log(err));

//         return updatedCart;
//       }
//     });
//   };

    const saveCartToDatabase = async (userId) => {
        try {
            await fetch(`/api/cart/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems }),
            });
        } catch (err) {
            console.error("Error saving cart to database:", err);
        }
    };

    const removeFromCart = (productId) => {
        setCartItems((prevCartItems ) => {
            return prevCart.filter(item => item.id !== productId)
        });
    }
    return (
    <ShopContext.Provider value={{cartItems, products, addToCart, saveCartToDatabase}}>
      {props.children}
    </ShopContext.Provider>
  )
}