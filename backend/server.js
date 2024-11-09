const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const app = express()
app.use(cors())
app.use(express.json()); // This line is important for parsing JSON request bodies

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'triple_js'
})

app.get('/', (req, res) => {
    return res.json("From Backend Side")
})
//get the products from the database
app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products WHERE status = true"
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

//get the products for the admin
app.get('/api/admin/products', (req, res) => {
    const sql = "SELECT * FROM products"; // Do not filter by status for this endpoint
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching products' });
        }
        return res.json(data);
    });
});

// app.post('/add-to-cart', (req, res) => {
//     const { productId, productName, productQuantity } = req.body;

//     // Ensure productId is present
//     if (!productId || !productName || !productQuantity) {
//         return res.status(400).json({ message: 'Invalid product data' });
//     }

//     const sql = "INSERT INTO cart (productId, productName, productQuantity) VALUES (?, ?, ?)";
//     db.query(sql, [productId, productName, productQuantity], (err, result) => {
//         if (err) {
//             console.error("Error inserting into cart:", err);
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//         return res.json({ message: "Item added to cart successfully" });
//     });
// });



app.post('/api/cart/:userId', (req, res) => {
    const userId = req.params.userId; // User ID from request params
    const cartItems = req.body.cartItems; // Cart items from the request body (array of products)

    const deleteCartQuery = 'DELETE FROM user_cart WHERE userId = ?';
    const insertCartQuery = 'INSERT INTO user_cart (userId, productId, quantity) VALUES ?';

    // Delete the existing cart for the user (so we can insert updated cart items)
    db.query(deleteCartQuery, [userId], (err, result) => {
        if (err) return res.status(500).json("Error clearing cart");

        if (cartItems.length > 0) {
            // Prepare cart items to be inserted into the database
            const cartData = cartItems.map(item => [userId, item.id, item.quantity]);

            // Insert new cart items into the database
            db.query(insertCartQuery, [cartData], (err, result) => {
                if (err) return res.status(500).json("Error saving cart items");

                return res.status(200).json("Cart saved successfully");
            });
        } else {
            // If there are no cart items, just return success
            return res.status(200).json("Cart is empty");
        }
    });
});


//get the items from cart
app.get('/cart', (req, res) => {
    const sql = "SELECT * FROM cart";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
}); 

app.listen(8081, ()=> {
    console.log("listening");
})

// Login endpoint
app.post('/login', (req, res) => {  
    const { username, password } = req.body;

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, result) => {
        if (err) return res.json(err);
        if (result.length === 0) return res.status(400).json("User not found");

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password

        if (!isMatch) return res.status(400).json("Invalid credentials");

        // Create and assign a token
        const token = jwt.sign({ id: user.userId }, 'your_secret_key', { expiresIn: '1h' });
        
        // Send back the token and the user id
        res.json({
             token, userId: user.userId, 
             role: user.role,
             username: user.name,
             address:  user.userAddress
            });
    });
}); 


// //Register Endpoint
// app.post('/register', async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//     const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
//     db.query(sql, [username, hashedPassword], (err, result) => {
//         if (err) return res.json(err);
//         return res.json("User registered successfully");
//     });
// });

app.post('/register', async (req, res) => {
    const { username, password, fullname, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const sql = "INSERT INTO users (username, password, name, userAddress) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, hashedPassword, fullname, address], (err, result) => {
        if (err) return res.json(err);
        return res.json("User registered successfully");
    });
});

//cart endpoint
app.get('/api/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT user_cart.productId, user_cart.quantity, products.name
        FROM user_cart
        JOIN products ON user_cart.productId = products.id
        WHERE user_cart.userId = ?
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json("Error retrieving cart items");
        return res.json(results); // Results now include { productId, quantity, name }
    });
});

// Place Order Endpoint
app.post('/api/place-order/:userId', (req, res) => {
    const userId = req.params.userId;
    const { cartItems, totalAmount } = req.body;

    // Insert order into the `orders` table
    const insertOrderQuery = `INSERT INTO orders (user_id, total_amount) VALUES (?, ?)`;

    db.query(insertOrderQuery, [userId, totalAmount], (err, orderResult) => {
        if (err) return res.status(500).json({ error: "Failed to create order" });

        const orderId = orderResult.insertId;

        // Prepare data for bulk insertion into the `order_items` table
        const orderItems = cartItems.map(item => [orderId, item.id, item.quantity, item.price]);

        const insertOrderItemsQuery = `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`;

        db.query(insertOrderItemsQuery, [orderItems], (err, itemsResult) => {
            if (err) return res.status(500).json({ error: "Failed to add order items" });

            return res.status(200).json({ message: "Order placed successfully", orderId });
        });
    });
});

//orders endpoint
app.get('/api/admin/orders', (req, res) => {
    const getOrdersQuery = `
        SELECT 
            orders.order_id, 
            orders.user_id, 
            orders.order_date, 
            orders.status, 
            orders.total_amount,
            users.name as user_name,
            GROUP_CONCAT(CONCAT(order_items.product_id, ':', order_items.quantity, ':', order_items.price)) as items
        FROM orders
        JOIN order_items ON orders.order_id = order_items.order_id
        JOIN users ON orders.user_id = users.userId
        GROUP BY orders.order_id;
    `;

    db.query(getOrdersQuery, (err, results) => {
        if (err) return res.status(500).json("Error retrieving orders");
        res.status(200).json(results);
    });
});

//change pending to completed
app.put('/api/orders/:orderId/complete', (req, res) => {
    const orderId = req.params.orderId;

    const updateOrderQuery = 'UPDATE orders SET status = ? WHERE order_id = ?';
    db.query(updateOrderQuery, ['completed', orderId], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            return res.status(500).json({ message: "Failed to update order status" });
        }
        res.status(200).json({ message: "Order status updated successfully" });
    });
});

app.put('/api/products/:id/deactivate', (req, res) => {
    const productId = req.params.id;
    const sql = 'UPDATE products SET is_active = false WHERE id = ?';
    
    db.query(sql, [productId], (err, result) => {
      if (err) {
        console.error("Error deactivating product:", err);
        return res.status(500).json("Failed to deactivate product");
      }
      res.status(200).json("Product deactivated successfully");
    });
  });

  //toggle status
  app.put('/api/products/:id/status', (req, res) => {
    const productId = req.params.id;
    const { status } = req.body; // Status can be either 1 (Active) or 0 (Inactive)
  
    const sql = 'UPDATE products SET status = ? WHERE id = ?';
    db.query(sql, [status, productId], (err, result) => {
      if (err) {
        console.error("Error updating product status:", err);
        return res.status(500).json("Failed to update product status");
      }
      res.status(200).json("Product status updated successfully");
    });
  });


  app.post('/api/add-product', (req, res) => {
    const { name, price, image, quantity } = req.body;

    // Validate required fields
    if (!name || price === undefined || quantity === undefined || !status) {
        return res.status(400).json({ error: "name, price, image, and quantity are required" });
    }

    // SQL query to insert a new product
    const insertProductQuery = `
        INSERT INTO products (name, price, image, quantity)
        VALUES (?, ?, ?, ?)
    `;

    // Execute the query
    db.query(insertProductQuery, [name, price, image, quantity], (err, result) => {
        if (err) {
            console.error("Error inserting product:", err);
            return res.status(500).json({ error: "Failed to add product" });
        }

        res.status(201).json({
            message: "Product added successfully",
            productId: result.insertId, // return the ID of the newly inserted product
        });
    });
    });
