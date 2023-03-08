const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String, 
        required: [true, "Product Name is Required"]
    },

    description: {
        type: String, 
        required: [true, "Description is Required"]
    },

    price: {
        type: Number,
        required: [true, "Price is Required"]
    },

    stocks: {
        type: Number,
        required: [true, "Stocks is Required"]
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdOn: {
        type: Date,
        default: new Date()
    },

    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },

            username: {
                type: String
            },

            rating: {
                type: Number
            },

            comment: {
                type: String
            },

            createdOn: {
                type: Date,
                default: new Date()
            }
        }
    ]

    
});

module.exports = mongoose.model('Product', productSchema);