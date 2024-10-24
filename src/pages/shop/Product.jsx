import React, { useContext } from 'react'
import { ShopContext } from '../../context/shop-context';


const Product = (props) => {
  const { addToCart } = useContext(ShopContext);
  const {id, name, price, image, quantity} = props.data;
  return (
    <div className='product'>
      <img src={image} alt="" />
      <div className="description">
        <p><b>{name}</b></p>
        <p>${price}</p>
        <p>{quantity}</p>
      </div>
      <div className="addToCartBttn" onClick={() => addToCart(props.data)}>Add to Cart</div>

    </div>
  )
}

export default Product
