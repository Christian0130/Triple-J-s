import React, { useContext } from 'react'
import { ShopContext } from '../../context/shop-context';
import "./shop.css";


const Product = (props) => {
  const { addToCart } = useContext(ShopContext);
  const {id, name, price, image, quantity} = props.data;
  return (
    <div className='product'>
      <div className="product-image-container">
      <img src={image} alt="" />
      </div>
      <div className="description">
        <p>{name}</p>
        <p>₱{price}</p>
        <div className="addToCartBttn" onClick={() => addToCart(props.data)}>Add to Cart</div>
      </div>

    </div>
  )
}

export default Product