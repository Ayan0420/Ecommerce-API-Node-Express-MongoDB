//Database models
const User = require('../models/User');
const Product = require('../models/Product')

//User add to cart
module.exports.addToCart = async (data) => {

    let productData = await Product.findById(data.productId).then(((productData, error) => {
        if(error){
            console.log("Error from productData var: " + error);
        } else {
            if(productData == null){
                //used for validation later in the code, false means not product found
                return false
                //check if there's stock or the product is active
            } else if(productData.stocks >= data.orderQuantity && productData.isActive == true) {
                return productData
            } else {
                //used for validation later in the code, null means no stock or not available
                return null
            }
        }
    })).catch(error => {
        console.log("Error from productData var: " + error)
        //used for validation later in the code, false means not product found
        return false;
    });

    // console.log("productData: " + productData) //for testing/debugging

    //the validation I am mention earlier, false means product not existent, null means no stock or unavailable
    if(productData == false){
        let msg = {
            response: false,
            error: "Product doesn't exist.",
            };
        return msg;
    } else if(productData == null) {
        let msg = {
            response: false,
            error: "Product doesn't have enough stock or is not available.",
            };
        return msg;
    } else {
        return User.findById(data.userId).then(userData => {
            let productAddedToCart = {
                productId: data.productId,
                productName: productData.productName,
                price: productData.price,
                quantity: data.orderQuantity,
                subTotal: productData.price * data.orderQuantity
            }
            
            userData.cartItems.push(productAddedToCart);
            return userData.save().then((result, error) => {
                if(error){
                    console.log(error);
                } else {
                    let msg = {
                        message: "Added to cart successfully!",
                        itemAddedToCart: result.cartItems
                    }
                    console.log(result); //for testing/debugging
                    return msg;
                }
            })
        });
    }
};