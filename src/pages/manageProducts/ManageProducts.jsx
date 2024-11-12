import React, { useState, useEffect } from 'react';
import "./manageProducts.css";
import Modal from '../../components/Modal';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    quantity: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/admin/products');
            const data = await response.json();
            setProducts(data); // Set both active and inactive products
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    fetchProducts();
}, []);


  // Add new product
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8081/api/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const updatedProducts = await response.json();
         // Generate a temporary id if the backend doesn't provide one
        updatedProducts.id = updatedProducts.id || Date.now(); // Or use Math.random()
        setProducts([...products, updatedProducts]);
        setNewProduct({ name: '', price: '', image: '', quantity: '' });
        window.alert("Product Added Successfully")
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  //Change the product Status
  const toggleProductStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle the status (1 = Active, 0 = Inactive)
      const response = await fetch(`http://localhost:8081/api/products/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (response.ok) {
        // Update the product's status in the local state
        setProducts(
          products.map((product) =>
            product.id === id ? { ...product, status: newStatus } : product
          )
        );
      }
    } catch (err) {
      console.error("Error toggling product status:", err);
    }
  };
  

  return (
    <div>
      <h1 className='product-manager'>Product Manager</h1>
      
      <div className='open-modal-button-container'>
              {/* Button to open modal */}
        <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
          Add New Product
        </button>
      </div>

      {/* Modal for adding a new product */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className='form-container'>
            <h2>Add New Product</h2>
            <form onSubmit={addProduct} className='addProduct-form'>
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
                placeholder="Image URL"
                value={newProduct.image}
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
              />
              <button type="submit">Add Product</button>
            </form>
          </div>
        </Modal>
      )}
    

      <div className='table-container'>
        <table className='fl-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  {/* Add a button to toggle the product status */}
                  <button onClick={() => toggleProductStatus(product.id, product.status)}>
                    {product.status === 1 ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
