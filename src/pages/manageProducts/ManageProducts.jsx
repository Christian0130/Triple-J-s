import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  // Fetch all products
  useEffect(() => {
    fetch('http://localhost:8081/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  // Add new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const updatedProducts = await response.json();
        setProducts([...products, updatedProducts]);
        setNewProduct({ name: '', price: '', description: '', imageUrl: '' });
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== id));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div>
      <h2>Manage Products</h2>
      
      {/* Form to add new product */}
      <form onSubmit={addProduct}>
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      {/* List of current products */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <p>{product.name}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
