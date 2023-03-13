const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({

    sellerName: {
        type: String,
        required: [true, "Seller Name is required."]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Product Id is required."]
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id is required."]
        }
    ],

    avgRating: {
        type: Number,
        default: 0
    },

    createdOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("Seller", sellerSchema);