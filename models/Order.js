const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },

            quantity: {
                type: Number
            },

            subTotal: {
                type: Number
            }

        }
    ],

    totalAmount: {
        type: Number
    },

    status: {
        type: String,
        default: "Pending"
    },

    purchasedOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model("Order", orderSchema);