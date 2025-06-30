const express = require('express'); // Import express
const cors = require('cors'); // Import cors for cross-origin resource sharing
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
require("./db/config"); // Import database configuration

const app = express(); // Create express app
const User = require("./db/User"); // Import User model
const Product = require("./db/Product"); // Import Product model
const authenticateToken = require('./middleware/auth'); // Import auth middleware

app.use(express.json()); // Middleware to parse JSON data
app.use(cors()); // Enable CORS for all routes

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// User Registration
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Create new user
        const user = new User({ username, email, password });
        const result = await user.save();

        // Generate token
        const token = generateToken(result._id);

        // Send response without password
        const userResponse = {
            _id: result._id,
            username: result.username,
            email: result.email,
            token
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response without password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        };

        res.json(userResponse);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all products (public route)
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find().populate('userId', 'username');
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's products (protected route)
app.get("/my-products", authenticateToken, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.user._id });
        res.json(products);
    } catch (error) {
        console.error('Get my products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add new product (protected route)
app.post("/add-product", authenticateToken, async (req, res) => {
    try {
        const { name, price, brand, category, description, image } = req.body;

        // Basic validation
        if (!name || !price || !brand || !category) {
            return res.status(400).json({ error: 'Name, price, brand, and category are required' });
        }

        const product = new Product({
            name,
            price,
            brand,
            category,
            description,
            image,
            userId: req.user._id
        });

        const result = await product.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update product (protected route)
app.put("/update-product/:id", authenticateToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, brand, category, description, image } = req.body;

        // Find product and check ownership
        const product = await Product.findOne({ _id: productId, userId: req.user._id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found or not authorized' });
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, price, brand, category, description, image },
            { new: true, runValidators: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete product (protected route)
app.delete("/delete-product/:id", authenticateToken, async (req, res) => {
    try {
        const productId = req.params.id;

        // Find product and check ownership
        const product = await Product.findOne({ _id: productId, userId: req.user._id });
        if (!product) {
            return res.status(404).json({ error: 'Product not found or not authorized' });
        }

        await Product.findByIdAndDelete(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single product by ID
app.get("/product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('userId', 'username');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Search products
app.get("/search/:key", async (req, res) => {
    try {
        const key = req.params.key;
        const products = await Product.find({
            $or: [
                { name: { $regex: key, $options: 'i' } },
                { brand: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } }
            ]
        }).populate('userId', 'username');
        
        res.json(products);
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user profile (protected route)
app.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); // Listen on port from environment or 5000