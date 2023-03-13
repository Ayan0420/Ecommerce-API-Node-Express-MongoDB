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
                ref: "User",
                required: [true, "User Id is required."]
            },

            rating: {
                type: Number,
                min: [1, "Ratings must be between 1 to 5"],
                max: [5, "Ratings must be between 1 to 5"]
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