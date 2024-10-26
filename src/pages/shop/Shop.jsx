import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/shop-context';
import Product from './Product';
import "./shop.css"
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const userId = localStorage.getItem('userId'); // Retrieve user ID
  const { products } = useContext(ShopContext); 
  const navigate = useNavigate();
  console.log(userId);

  return (
    <div className='shop'>
      <div className="background-image-container">
        <img src="https://images.pexels.com/photos/16611344/pexels-photo-16611344/free-photo-of-close-up-of-cats-heads.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
        <div className='shopTitle'>Affordable care for your <br /> feathered and furry friends.</div>
        <a href="#shop"><button>Shop Now</button></a>
      </div>
      <div className='title' id='shop'><h1>Shop</h1></div>
      <div className="products">
      {products.map((product) => (
        <Product key={product.id} data={product}/>
        ))} 
      </div>
    </div>
  )
}

export default Shop
