import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './shop.css'
import { ShopContext } from '../../context/shop-context';

const ProductInfo = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(ShopContext);
  const [cartMessageVisible, setCartMessageVisible] = useState(false);

  useEffect(() => {
    // Fetch product details from your API
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
      }
    };

    fetchProduct();
  }, [id]);

    // Disable button if quantity exceeds available stock
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // Check if the desired quantity exceeds the available stock
        if (quantity > product.quantity) {
          alert(`Only ${product.quantity} units of ${product.name} are available.`);
          return;
        }
      
        if (quantity < 1) {
          alert('Quantity must be at least 1.');
          return;
        }
      
        // Add the product to the cart with the specified quantity
        addToCart(product, quantity);
      
        // Show the "Added to cart" message
        setCartMessageVisible(true);
      
        // Hide the message after 2 seconds
        setTimeout(() => {
          setCartMessageVisible(false);
        }, 2000);
      };
      
  

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className='product-info-container'>
        <h1 className='product-information'>Product Information</h1>
      <div className="product-info">
        <div className='productinfo-img-container'>
            <img src={product.image} alt={product.name} />
        </div>
        <div className='productinfo-description'>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price.toFixed(2)}</p>
            <input type="number" 
            placeholder='Quantity'
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <div className={`added-to-cart ${cartMessageVisible ? 'visible' : ''}`}>Added</div>
            <button className="addToCartBttn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
