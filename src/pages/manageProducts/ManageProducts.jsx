import React, { useState, useEffect } from 'react';
import "./manageProducts.css";
import Modal from '../../components/Modal';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    quantity: '',
    description: ''
  });
  const [currentProduct, setCurrentProduct] = useState(null); // For editing product
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal for editing

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/admin/products');
        const data = await response.json();
        setProducts(data);
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
        updatedProducts.id = updatedProducts.id || Date.now(); // Temporary ID
        setProducts([...products, updatedProducts]);
        setNewProduct({ name: '', price: '', image: '', quantity: '', description: '' });
        setIsModalOpen(false); // Close the modal
        window.alert("Product Added Successfully");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Open the edit modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle editing the product
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/api/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentProduct),
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === currentProduct.id ? currentProduct : product
          )
        );
        setIsEditModalOpen(false); // Close the modal
        window.alert('Product updated successfully');
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <div>
      <h1 className="product-manager">Product Manager</h1>

      <div className="open-modal-button-container">
        {/* Button to open "Add Product" modal */}
        <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
          Add New Product
        </button>
      </div>

      {/* Modal for adding a new product */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="form-container">
            <h2>Add New Product</h2>
            <form onSubmit={addProduct} className="addProduct-form">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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

      {/* Table displaying products */}
      <div className="table-container">
        <table className="fl-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>₱{product.price}</td>
                <td>{product.quantity} lbs</td>
                <td>{product.status === 1 ? 'Active' : 'Inactive'}</td>
                <td>
                  <button
                    className="editProductButton"
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing the product */}
      {isEditModalOpen && currentProduct && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="edit-product-form-container">
            <h2>Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="editProduct-form">
              <input
                type="text"
                placeholder="Name"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                value={currentProduct.description}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, description: e.target.value })
                }
              /> 
              <input
                type="number"
                placeholder="Price"
                value={currentProduct.price}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, price: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                value={currentProduct.quantity}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, quantity: e.target.value })
                }
              />
              <select
                value={currentProduct.status}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, status: Number(e.target.value) })
                }
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageProducts;
