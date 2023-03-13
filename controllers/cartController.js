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

//Retrieve all cart items
module.exports.getAllCartItems = (data) => {
    return User.findById(data.userId).then((userData, error) => {
        if(error){
            let msg = {
                response: false,
                error: "Error retrieving cart items.",
                };
            return msg;
        } else if(userData.cartItems.length == 0){
            let msg = {
                    message: "Cart is empty.",
                    };
                return msg;
        } else {
            return userData.cartItems
        }
    }).catch(error => {
        let msg = {
            response: false,
            error: "Error retrieving cart items.",
        };
        console.log(error);
        return msg;
    });
};

//Remove cart items
module.exports.removeCartItems =  async (data) => {

    //Promise all help use resolve each of the promise that are returned
    let updatedCartItems = await Promise.all(data.cartItemId.map( async cartItem => {

        return User.findByIdAndUpdate(data.userId, {
                $pull: {
                    cartItems: {_id: cartItem}
                }
            }, { new: true }).then((userData, error) => {
            if(error){
                console.log(error)
            } else {
                console.log("cartItems update success")
                if(userData.cartItems.length == 0){
                    return userData.cartItems = "empty"
                } else {
                    return userData.cartItems;
                }
            }
        }); 
        //this returns an array of promises so we need to wrap the whole array map with Promise.all
        
    })).then(result => result);
    
    console.log(updatedCartItems)
    let msg = {
        message: Promise.resolve("Cart item/s deleted"),
        currentCart: updatedCartItems
    }
    return msg;
};