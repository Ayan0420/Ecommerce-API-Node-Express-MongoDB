const mongoose = require('mongoose');

//Activty Output
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required!"],
    },

    lastName: {
        type: String,
        required: [true, "Last Name is required!"],
    },

    email: {
        type: String,
        required: [true, "Email is required!"],
    },
    
    password: {
        type: String,
        required: [true, "Password is required!"],
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    mobileNo: {
        type: String,
        required: [true, "Mobile Number is required!"],
    },

    cartItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product Id is required."]
            },

            productName: {
                type: String,
                required: [true, "Product Name is required!"],
            },
            
            price: {
                type: Number,
                required: [true, "Product Price is required!"],
            },

            quantity: {
                type: Number,
                required: [true, "Product Quantity is required!"],
            },

            subTotal: {
                type: Number
            }
        }
    ],
});

module.exports = mongoose.model("User", userSchema);
//Activty Output End