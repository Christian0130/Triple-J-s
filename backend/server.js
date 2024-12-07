const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const app = express()
app.use(cors())
app.use(express.json()); // This line is important for parsing JSON request bodies

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'triple_js'
})

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use a specific SMTP server
  auth: {
    user: 'xtianxd0130@gmail.com', // Replace with your email
    pass: 'ibdyfbgxoilpjmsf' // Use an app password if using Gmail
  }
});

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
    const { username, password, fullname, address, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const sql = "INSERT INTO users (username, password, name, userAddress, email) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [username, hashedPassword, fullname, address, email], (err, result) => {
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
    users.name AS user_name,
    GROUP_CONCAT(CONCAT(order_items.product_id, ':', order_items.quantity, ':', order_items.price, ':', products.name)) AS items
FROM orders
LEFT JOIN order_items ON orders.order_id = order_items.order_id
LEFT JOIN products ON order_items.product_id = products.id
JOIN users ON orders.user_id = users.userId
GROUP BY orders.order_id;

    `;

    db.query(getOrdersQuery, (err, results) => {
        if (err) return res.status(500).json("Error retrieving orders");
        res.status(200).json(results);
    });
});

app.put('/api/orders/:orderId/complete', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch the order details, including user email
    const orderDetails = await new Promise((resolve, reject) => {
      db.query(
        `SELECT o.user_id, u.email, o.order_date 
         FROM orders o 
         JOIN users u ON o.user_id = u.userId 
         WHERE o.order_id = ?`,
        [orderId],
        (error, results) => {
          if (error) reject(error);
          else resolve(results[0]); // Assuming one result
        }
      );
    });

    if (!orderDetails) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Fetch the order items to get product details
    const orderItems = await new Promise((resolve, reject) => {
      db.query(
        `SELECT p.name, oi.quantity 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [orderId],
        (error, results) => {
          if (error) reject(error);
          else resolve(results);
        }
      );
    });

    // Reduce the quantity for each product
    for (const item of orderItems) {
      await new Promise((resolve, reject) => {
        db.query(
          'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, item.product_id],
          (error) => {
            if (error) reject(error);
            else resolve();
          }
        );
      });
    }

    // Mark the order as completed
    await new Promise((resolve, reject) => {
      db.query(
        'UPDATE orders SET status = "completed" WHERE order_id = ?',
        [orderId],
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // Format order items for email
    const formattedOrderItems = orderItems
      .map((item) => `${item.name}: ${item.quantity}`)
      .join('\n');

    // Send email to the user
    const mailOptions = {
      from: 'xtianxd0130@gmail.com',
      to: orderDetails.email,
      subject: 'Your Order is Completed!',
      text: `Hello,

Thank you for your order placed on ${orderDetails.order_date}. 

Your order has been successfully Processed. Below are the details:

${formattedOrderItems}

Expect your order to be delivered within 2-3 business days.

We hope to serve you again soon!

Best regards,
TripleJs`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Order marked as completed, product quantities updated, and email sent.' });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: 'Error completing order.' });
  }
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
    const { name, description, price, image, quantity } = req.body;

    // Validate required fields
    if (!name || price === undefined || quantity === undefined || description === undefined ) {
        return res.status(400).json({ error: "name, description, price, image, and quantity are required" });
    }

    // SQL query to insert a new product
    const insertProductQuery = `
        INSERT INTO products (name, price, image, quantity, description)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Execute the query
    db.query(insertProductQuery, [name, price, image, quantity, description], (err, result) => {
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


    //=============================================================================================================//
    //Api Endpoints For Admin Dashboard
    app.get('/api/total-sales', async (req, res) => {
      try {
          const result = await new Promise((resolve, reject) => {
              db.query('SELECT SUM(total_amount) AS totalSales FROM orders WHERE status = "completed"', (error, results) => {
                  if (error) reject(error);
                  else resolve(results);
              });
          });
          
          // Extract totalSales from the result
          const totalSales = result && result[0] && result[0].totalSales ? result[0].totalSales : 0;
          res.json({ totalSales });
      } catch (error) {
          console.error('Error fetching total sales:', error);
          res.status(500).json({ error: 'Error fetching total sales' });
      }
  });
  
      
  app.get('/api/total-orders', (req, res) => {
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS totalOrders FROM orders WHERE status = "completed"', (err, result) => {
        if (err) {
          console.error('Error fetching total orders:', err);
          reject(err);
        } else {
          const totalOrders = result && result[0] && result[0].totalOrders ? result[0].totalOrders : 0;
          resolve(totalOrders);
        }
      });
    })
    .then((totalOrders) => {
      res.json({ totalOrders });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching total orders' });
    });
  });

  app.get('/api/total-orders-pending', (req, res) => {
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS totalOrders FROM orders WHERE status = "pending"', (err, result) => {
        if (err) {
          console.error('Error fetching total orders:', err);
          reject(err);
        } else {
          const totalOrders = result && result[0] && result[0].totalOrders ? result[0].totalOrders : 0;
          resolve(totalOrders);
        }
      });
    })
    .then((totalOrders) => {
      res.json({ totalOrders });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching total orders' });
    });
  });

  app.get('/api/total-products', (req, res) => {
    new Promise((resolve, reject) => {
      db.query('SELECT COUNT(*) AS totalProducts FROM products WHERE status = 1', (err, result) => {
        if (err) {
          console.error('Error fetching total products:', err);
          reject(err);
        } else {
          const totalProducts = result && result[0] && result[0].totalProducts ? result[0].totalProducts : 0;
          resolve(totalProducts);
        }
      });
    })
    .then((totalProducts) => {
      res.json({ totalProducts });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching total products' });
    });
  });
  
      app.get('/api/top-products', (req, res) => {
        new Promise((resolve, reject) => {
          db.query(`
            SELECT p.id, p.name, SUM(oi.quantity) AS totalSold, SUM(oi.quantity * oi.price) AS revenue
            FROM order_items AS oi
            JOIN products AS p ON oi.product_id = p.id
            GROUP BY p.id, p.name
            ORDER BY totalSold DESC
            LIMIT 5
          `, (err, result) => {
            if (err) {
              reject('Error fetching top products: ' + err);
            } else {
              resolve(result);
            }
          });
        })
        .then((result) => {
          res.json(result); // Send the top products data to the frontend
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Server error' }); // Return a 500 error if there's an issue
        });
      });
      

      app.get('/api/dashboard/orders-status', async (req, res) => {
        try {
          const result = await db.query(`
            SELECT status, COUNT(order_id) AS count
            FROM orders
            GROUP BY status
          `);
          res.json(result);
        } catch (error) {
          console.error('Error fetching orders by status:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
        
      app.get('/api/dashboard/sales-trend', async (req, res) => {
        try {
          const result = await new Promise((resolve, reject) => {
            db.query(`
              SELECT DATE(order_date) AS date, SUM(total_amount) AS dailySales
              FROM orders
              WHERE status = "completed"
              GROUP BY DATE(order_date)
              ORDER BY date ASC
            `, (error, results) => {
              if (error) reject(error);
              else resolve(results);
            });
          });
          
          // If the query returns results, send them as a response
          res.json(result);
        } catch (error) {
          console.error('Error fetching sales trend:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
      

      app.get('/api/total-customers', (req, res) => {
        new Promise((resolve, reject) => {
          db.query('SELECT COUNT(*) AS totalCustomers FROM users WHERE role = "user"', (err, result) => {
            if (err) {
              console.error('Error fetching total customers:', err);
              reject(err);
            } else {
              const totalCustomers = result && result[0] && result[0].totalCustomers ? result[0].totalCustomers : 0;
              resolve(totalCustomers);
            }
          });
        })
        .then((totalCustomers) => {
          res.json({ totalCustomers });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Error fetching total customers' });
        });
      });
      
      app.put('/api/products/:id', async (req, res) => {
        const { id } = req.params;
        const { name, price, quantity, status, description } = req.body;
      
        try {
          await db.query('UPDATE products SET name = ?, price = ?, quantity = ?, status = ?, description = ? WHERE id = ?', [
            name, price, quantity, status, description, id,
          ]);
          res.json({ message: 'Product updated successfully' });
        } catch (error) {
          console.error('Error updating product:', error);
          res.status(500).json({ error: 'Server error' });
        }
      });
      
      app.get('/api/users/:userId', (req, res) => {
        const { userId } = req.params;
    
        db.query(
            'SELECT username, email, userAddress, name FROM users WHERE userId = ?',
            [userId],
            (error, results) => {
                if (error) {
                    console.error('Error fetching user data:', error);
                    return res.status(500).json({ error: 'Failed to fetch user data' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.status(200).json(results[0]); // Send user data as JSON
            }
        );
    });
    
    app.put('/api/users/:userId', (req, res) => {
      const { userId } = req.params;
      const { name, userAddress, email, username } = req.body;
  
      db.query(
          'UPDATE users SET name = ?, userAddress = ?, email = ?, username = ? WHERE userId = ?',
          [name, userAddress, email, username, userId],
          (error, results) => {
              if (error) {
                  console.error('Error updating user data:', error);
                  return res.status(500).json({ error: 'Failed to update user data' });
              }
              res.status(200).json({ message: 'User data updated successfully.' });
          }
      );
  });