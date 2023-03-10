//Database models
const Product = require('../models/Product');
const Order = require('../models/Order')

//Create order (needs refactoring in relation to add our cart)
module.exports.createOrder = async (data) => {
    //initialize the array for the ordered products with its price, quantity and subTotal
    let orderedProductsArray = [];
    //Loop through the data.productId array and retrieve the information of each product
    //then append that information to the orderedProductsArray
    for(let i=0; i < data.productId.length; i++){
        //retrieve the product price
        let price = await Product.findById(data.productId[i]).then((productData, error) => {
            if(error){
                console.log("Error from price var(then err): " + error);
            } else {
                //checking the stocks when purchasing the product
                if(productData.stocks >= data.orderQuantity[i] && productData.isActive == true){
                    //return the price when successful
                    return productData.price
                    
                } else {
                    //if there is 0 stock return false, this is for validation later in the code
                    return false
                }
            }
        }).catch(error => console.log("Error from price var(catch): " + error));

        if(price == false){
            //if the price variable return false, it will reassign the value of the orderedProductArray to null and break out of the loop. This will be used for validation later in the code
            orderedProductsArray = null;
            break;

        } else {
            //Append ordered products to orderedProductsArray
            orderedProductsArray.push({
                productId: data.productId[i],
                quantity: data.orderQuantity[i],
                subTotal: price * data.orderQuantity[i],
            });
            
        }
    } 

    console.log("orderedProductsArray: " + JSON.stringify(orderedProductsArray)); //for testing/debugging

    //the validation I mention earlier
    if(orderedProductsArray == null){
        let msg = {
            response: false,
            error: "Some products doesn't have enough stock or is not available.",
            };
        return msg;
    } else {

        // //testing
        // let isNullSubTotalExist = orderedProductsArray.every(item => {
        //     console.log("item.subTotal: " + item.subTotal + " " + typeof item.subTotal)
        //     return item.subTotal != "null";
        // }); //  I am stuck to this..... it does not return the correct output

        // console.log("isNullSubTotalExist: " + isNullSubTotalExist)
        
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
                for(let i=0; i < data.productId.length; i++){
                    //Retrieve the data of each prodct
                    Product.findById(data.productId[i]).then((productData, error) => {
                        productData.stocks -= data.orderQuantity[i];

                        productData.save().then((result) => {
                            console.log(`Stocks updated successfully: decreased ${result.productName} stocks to ${result.stocks}`);
                        }).catch(error => console.log("Error from updating stocks: " + error));

                    }).catch(error => console.log("Error from updating stocks: " + error));
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
        return Order.find({}).populate({path: "userId", select: ["_id", "firstName", "lastName", "email", "mobileNo"]}).populate({path: "products", populate: {path: "productId", select: ["_id", "productName", "description", "price"]}}).sort({"purchasedOn": -1}).then((orderData, error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Error obtaining orders.",
                    };
                console.log("error from get all order: " + error);
                return msg;
            } else {
                return orderData
            }
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