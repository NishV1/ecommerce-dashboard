const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    brand: String,
    category: String,
    description: String,
    image: String
});
module.exports = mongoose.model('products', productSchema); // Export the model