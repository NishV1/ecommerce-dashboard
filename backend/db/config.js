const mongoose = require('mongoose'); //Import mongoose
require('dotenv').config(); // Load environment variables

mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/e-comm')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err)); // Connect to database with error handling