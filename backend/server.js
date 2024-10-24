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
        res.json({ token, userId: user.userId }); // Add userId in the response
    });
});


//Register Endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) return res.json(err);
        return res.json("User registered successfully");
    });
});