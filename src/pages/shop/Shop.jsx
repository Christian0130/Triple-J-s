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
      <div className='shopTitle'>
        <h1>Shop</h1>
      </div>
      <div className="products">
      {products.map((product) => (
        <Product key={product.id} data={product}/>
        ))} 
      </div>
    </div>
  )
}

export default Shop
