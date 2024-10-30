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
    const sql = "SELECT * FROM products"
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
})

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
        res.json({ token, userId: user.userId, role: user.role }); // Add userId in the response
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