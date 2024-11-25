import React, { useContext, useState} from 'react'
import { ShopContext } from '../../context/shop-context';
import "./shop.css";


const Product = (props) => {
  const { addToCart } = useContext(ShopContext);
  const { id, name, price, image, quantity } = props.data;

  // Disable button if quantity exceeds available stock
  const [quantityInCart, setQuantityInCart] = useState(0);

  const handleAddToCart = () => {
    if (quantityInCart < quantity) {
      addToCart(props.data);
      setQuantityInCart(quantityInCart + 1);  // Update local cart quantity
    } else {
      alert(`Only ${quantity} units of ${name} are available.`);
    }
  };

  return (
    <div className='product'>
      <div className="product-image-container">
        <img src={image} alt="" />
      </div>
      <div className="description">
        <div className="product-name limit-text-to-2-lines">
          <p>{name}</p>
        </div>
        <p>₱{price}</p>
        <div className="addToCartBttn" onClick={handleAddToCart} disabled={quantityInCart >= quantity}>
          Add to Cart
        </div>
      </div>
    </div>
  );
};


export default Product;

