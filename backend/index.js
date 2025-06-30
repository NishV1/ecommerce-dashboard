const express = require('express'); // Import express
const cors = require('cors'); // Import cors for cross-origin resource sharing
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables
require("./db/config"); // Import database configuration

const app = express(); // Create express app
const User = require("./db/User"); // Import User model
const Product = require("./db/Product"); // Import Product model
const Contact = require("./db/Contact"); // Import Contact model
const Wishlist = require("./db/Wishlist"); // Import Wishlist model
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

// Increment product view count
app.put("/product/:id/view", async (req, res) => {
    try {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] View increment requested for product ID: ${req.params.id}`);
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('userId', 'username');
        
        if (!product) {
            console.log(`[${timestamp}] Product not found for view increment`);
            return res.status(404).json({ error: 'Product not found' });
        }
        
        console.log(`[${timestamp}] View count incremented. New count: ${product.views}`);
        res.json(product);
    } catch (error) {
        console.error('Update view count error:', error);
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

// Advanced search with filters
app.get("/products/filter", async (req, res) => {
    try {
        const { 
            search, 
            category, 
            brand, 
            minPrice, 
            maxPrice, 
            sortBy = 'createdAt', 
            sortOrder = 'desc',
            page = 1,
            limit = 20
        } = req.query;

        // Build filter object
        let filter = {};

        // Text search
        if (search && search.trim()) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category && category !== 'all') {
            filter.category = { $regex: category, $options: 'i' };
        }

        // Brand filter
        if (brand && brand !== 'all') {
            filter.brand = { $regex: brand, $options: 'i' };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        // Sort options
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Calculate skip for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query with pagination
        const products = await Product.find(filter)
            .populate('userId', 'username')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        res.json({
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalProducts,
                hasNext: parseInt(page) < totalPages,
                hasPrev: parseInt(page) > 1
            },
            filters: {
                search,
                category,
                brand,
                minPrice,
                maxPrice,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get unique categories and brands for filters
app.get("/products/meta", async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        const brands = await Product.distinct('brand');
        
        // Get price range
        const priceStats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            }
        ]);

        res.json({
            categories: categories.filter(cat => cat), // Remove empty values
            brands: brands.filter(brand => brand), // Remove empty values
            priceRange: priceStats[0] || { minPrice: 0, maxPrice: 1000 }
        });
    } catch (error) {
        console.error('Get products meta error:', error);
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

// Contact seller endpoint
app.post("/contact-seller", async (req, res) => {
    try {
        const { productId, buyerName, buyerEmail, buyerPhone, message } = req.body;

        // Validate required fields
        if (!productId || !buyerName || !buyerEmail || !message) {
            return res.status(400).json({ error: 'Product ID, buyer name, email, and message are required' });
        }

        // Get product to find seller
        const product = await Product.findById(productId).populate('userId', '_id');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create contact record
        const contact = new Contact({
            productId,
            sellerId: product.userId._id,
            buyerName,
            buyerEmail,
            buyerPhone,
            message
        });

        await contact.save();

        res.status(201).json({ 
            message: 'Your inquiry has been sent to the seller successfully!',
            contact: {
                id: contact._id,
                productId: contact.productId,
                buyerName: contact.buyerName,
                message: contact.message,
                createdAt: contact.createdAt
            }
        });
    } catch (error) {
        console.error('Contact seller error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get seller inquiries (protected route)
app.get("/seller-inquiries", authenticateToken, async (req, res) => {
    try {
        const inquiries = await Contact.find({ sellerId: req.user._id })
            .populate('productId', 'name price')
            .sort({ createdAt: -1 });

        res.json(inquiries);
    } catch (error) {
        console.error('Get seller inquiries error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Mark inquiry as read (protected route)
app.put("/inquiry/:id/read", authenticateToken, async (req, res) => {
    try {
        const inquiry = await Contact.findOne({ 
            _id: req.params.id, 
            sellerId: req.user._id 
        });

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        inquiry.status = 'read';
        await inquiry.save();

        res.json({ message: 'Inquiry marked as read' });
    } catch (error) {
        console.error('Mark inquiry as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add to wishlist (protected route)
app.post("/wishlist/add", authenticateToken, async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if user is trying to add their own product
        if (product.userId.toString() === req.user._id) {
            return res.status(400).json({ error: 'Cannot add your own product to wishlist' });
        }

        // Check if already in wishlist
        const existingWishlistItem = await Wishlist.findOne({
            userId: req.user._id,
            productId: productId
        });

        if (existingWishlistItem) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }

        // Add to wishlist
        const wishlistItem = new Wishlist({
            userId: req.user._id,
            productId: productId
        });

        await wishlistItem.save();

        res.status(201).json({ 
            message: 'Product added to wishlist successfully',
            wishlistItem: {
                id: wishlistItem._id,
                productId: wishlistItem.productId,
                createdAt: wishlistItem.createdAt
            }
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Product already in wishlist' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Remove from wishlist (protected route)
app.delete("/wishlist/remove/:productId", authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;

        const result = await Wishlist.findOneAndDelete({
            userId: req.user._id,
            productId: productId
        });

        if (!result) {
            return res.status(404).json({ error: 'Product not found in wishlist' });
        }

        res.json({ message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user's wishlist (protected route)
app.get("/wishlist", authenticateToken, async (req, res) => {
    try {
        const wishlistItems = await Wishlist.find({ userId: req.user._id })
            .populate({
                path: 'productId',
                populate: {
                    path: 'userId',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });

        // Filter out any items where the product might have been deleted
        const validWishlistItems = wishlistItems.filter(item => item.productId);

        res.json(validWishlistItems);
    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check if product is in user's wishlist (protected route)
app.get("/wishlist/check/:productId", authenticateToken, async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlistItem = await Wishlist.findOne({
            userId: req.user._id,
            productId: productId
        });

        res.json({ inWishlist: !!wishlistItem });
    } catch (error) {
        console.error('Check wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); // Listen on port from environment or 5000