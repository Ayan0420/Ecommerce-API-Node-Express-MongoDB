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
});

module.exports = mongoose.model("User", userSchema);
//Activty Output End