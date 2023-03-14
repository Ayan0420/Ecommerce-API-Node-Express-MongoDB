//Database models
const User = require("../models/User");
const Product = require('../models/Product');
const Order = require('../models/Order')

//Create order (needs refactoring in relation to add our cart)
module.exports.createOrder = async (data) => {
    //initialize the arrays for the ordered products with its price, quantity and subTotal, product info, and cart item id
    let orderedProductsArray = [];
    let productsDataArray = [];
    let cartItemIdArray = [];

    if(data.productId != undefined && data.orderQuantity != undefined && data.cartItemId == undefined){
        //Loop through the data.productId array and retrieve the information of each product then append that information to the orderedProductsArray
        for(let i=0; i < data.productId.length; i++){
            //retrieve the product price
            let productData = await Product.findById(data.productId[i]).then((productData, error) => {
                if(error){
                    console.log("Error from price var(then err): " + error);
                } else {
                    //checking the stocks when purchasing the product
                    if(productData.stocks >= data.orderQuantity[i] && productData.isActive == true){
                        //return the price when successful
                        return productData
                        
                    } else {
                        //if there is 0 stock return false, this is for validation later in the code
                        return false
                    }
                }
            }).catch(error => {
                console.log("Error from price var(catch): " + error)
            });
    
            if(productData == false){
                //if the price variable return false, it will reassign the value of the orderedProductArray to null and break out of the loop. This will be used for validation later in the code
                orderedProductsArray.push({product: false});
                break;
    
            } else {
                //Append ordered products to orderedProductsArray
                orderedProductsArray.push({
                    productId: data.productId[i],
                    quantity: data.orderQuantity[i],
                    subTotal: productData.price * data.orderQuantity[i],
                });
                //Append product data to productDataArray so that we can access it later in the code
                productsDataArray.push(productData);
                
            }
        } 

    } else if(data.cartItemId != undefined && data.productId == undefined && data.orderQuantity == undefined) {

        for(let i=0; i < data.cartItemId.length; i++){
            
            
            //retrieve the cart item info
            let orderData = await User.findById(data.userId).then(async (userData, error) => {
                if(error){
                    console.log("Error from orderData var(then err): " + error);
                } else {

                    let cartItemDataArray = userData.cartItems;

                    // console.log("cartItemDataArray: " + cartItemDataArray);

                    let cartItemData = cartItemDataArray.find(item => {
                        return item._id == data.cartItemId[i];
                    });

                    // console.log("cartItemData: " + cartItemData);

                    if(cartItemData == undefined){
                        
                        return false;
                    }
                    //retrieve product information by looping through the cartItemData array
                    let productData = await Product.findById(cartItemData.productId).then((productData, error) => {
                        if(error){
                            console.log("Error from productData var(then err): " + error);
                        } else {
                            if(productData == null){
                                return false
                            } else {
                                return productData;
                            }
                        }
                    }).catch(error => console.log("Error from productData var(catch): " + error));

                    //checking the stocks when purchasing the product
                    if(productData.stocks >= cartItemData.quantity && productData.isActive == true){
                        //return the cart item when successful
                        return {cartItemData, productData}
                        
                    } else {
                        //if there is 0 stock return false, this is for validation later in the code
                        return false
                    }
                }
            }).catch(error => console.log("Error from orderData var(catch): " + error));
    
            if(orderData == false){
                //if the orderData variable return false, it will reassign the value of the orderedProductArray to null and break out of the loop. This will be used for validation later in the code
                orderedProductsArray.push({cartItem: false});
                break;
    
            } else {
                //Append ordered products to orderedProductsArray
                orderedProductsArray.push({
                    productId: orderData.productData._id,
                    quantity: orderData.cartItemData.quantity,
                    subTotal: orderData.cartItemData.subTotal,
                });
                //Append product data to productDataArray so that we can access it later in the code
                productsDataArray.push(orderData.productData);

                //to retrieve all the cart item ids that we will delete later after the purchase
                cartItemIdArray.push(orderData.cartItemData._id)
                

            }
        }
        
    } else {
        let msg = {
            response: false,
            error: "Request body is incorrect. It must be either cartItemId only or productId with quantity.",
            };
        return msg;
    }

    // console.log("orderedProductsArray: " + JSON.stringify(orderedProductsArray)); //for testing/debugging
    // console.log("productsDataArray: " + JSON.stringify(productsDataArray)); //for testing/debugging
    // console.log("\n cartItemIdArray: " + cartItemIdArray)
    //the validation I mention earlier
    if(orderedProductsArray[0].product == false){
        let msg = {
            response: false,
            error: "Some products doesn't have enough stock or is not available.",
            };
        return msg;
    } else if(orderedProductsArray[0].cartItem == false){
        let msg = {
            response: false,
            error: "Cart item/s does not exist.",
            };
        return msg;
    } else {
        //create a newOrder object
        let newOrder = new Order({
            userId: data.userId,
            products: orderedProductsArray,
            //initialize to zero, this will be reassigned later in the code
            totalAmount: 0
        });
    
        //save the new order object and storing the result to the createdOrder variable
        let createdOrder = await newOrder.save().then((orderData, error) => {
            if(error){
                console.log("Error from createdOrder var: " + error)
            } else {
                return orderData;
            }
        }).catch(error => console.log("Error from createdOrder var: " + error));
        
        //To calculate the total amount
    
        //initialize the array of subtotal
        let orderSubTotalArray = [];
        //retrieve all the product subTotal and appending it to the orderSubTotalArray
        for(let i = 0; i < createdOrder.products.length; i++){
            
            orderSubTotalArray.push(createdOrder.products[i].subTotal)
        }
        
        //reasigning the value of the totalAmount from the sum orderSubTotalArray
        createdOrder.totalAmount = orderSubTotalArray.reduce((x, y) => {
            return x + y;
        })
    
        console.log("ordered products subtotal array: " + orderSubTotalArray);

        //saving the changes to the database
        return createdOrder.save().then((orderData ,error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Error creating order.",
                    };
                console.log("Error from saving createdOrder: " + error);
                return msg;
            } else {
                //Decrease number of stocks with the quantity purchased after the order was placed
                for(let i=0; i < productsDataArray.length; i++){
                    //Retrieve the data of each product and decrease each stocks
                    Product.findById(productsDataArray[i]._id).then(productData => {
                        productData.stocks -= orderedProductsArray[i].quantity;

                        productData.save().then((result) => {
                            console.log(`Stocks updated successfully: decreased ${result.productName} stocks to ${result.stocks}`);
                        }).catch(error => console.log("Error from updating stocks1: " + error));

                    }).catch(error => console.log("Error from updating stocks2: " + error));
                }

                // console.log("cartItemIdArray: " + cartItemIdArray[0])
                //Retrieve the data of the user and delete the item in the cart after purchase
                if(cartItemIdArray.length != 0){
                    cartItemIdArray.forEach(cartItem => {
                        User.findByIdAndUpdate(data.userId, {
                            $pull: {
                                cartItems: {_id: cartItem}
                            },
                        }, { new: true }).then(userData => {
                            
                           console.log("userData: " + userData);
        
                        }).catch(error => console.log("Error from deleting cartItem: " + error));
                    });
                }


                let msg = {
                    response: true,
                    message: `Order placed successfully.`,
                    orderDetails: orderData
                };
    
                return msg;
            } 
        });
    }
};

module.exports.getOrders = (data) => {
    return Order.find({userId: data.userId}).populate({path: "products", populate: {path: "productId", select: ["_id", "productName", "description", "price"]}}).sort({"purchasedOn": -1}).then((orderData, error) => {
        if(error){
            let msg = {
                response: false,
                error: "Error obtaining user orders.",
                };
            console.log("error from find order: " + error);
            return msg;
        } else {
            if(orderData.length == 0){
                let msg = {
                    response: false,
                    message: "User does not have any orders.",
                    };
                return msg;
            } else {
                return orderData;

            }
        }
    }).catch(error => {
        //if there is an error populating the data, like "populated = null", try resetting the orders collection, there might be products or users that doesn't exist anymore causing the error
        let msg = {
            response: false,
            error: "Error obtaining user orders.",
            };
        console.log("error from find order: " + error);
        return msg;
    });
};

module.exports.getAllOrders = (data) => {
    if(data.isAdmin == true){
        return Order.find({}).populate({path: "userId", select: ["_id", "firstName", "lastName", "email", "mobileNo"]}).populate({path: "products", populate: {path: "productId", select: ["_id", "productName", "description", "price"]}}).sort({"purchasedOn": -1}).then((ordersData, error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Error obtaining orders.",
                    };
                console.log("error from get all orders: " + error);
                return msg;
            } else {
                return ordersData
            }
        }).catch(error => {
            //if there is an error populating the data, like "populated = null", try resetting the orders collection, there might be products or users that doesn't exist anymore causing the error
            let msg = {
                response: false,
                error: "Error obtaining all orders.",
                };
            console.log("error from find all orders: " + error);
            return msg;
        });
    }

    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    });
    return msg.then(value => {
        return value;
    });
};