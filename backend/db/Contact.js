const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    buyerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    buyerPhone: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('contacts', contactSchema);
