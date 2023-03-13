//Database models
const Product = require('../models/Product');
const Order = require('../models/Order')

//Add a product
module.exports.addProduct = (data) => {
    console.log(data.isAdmin)
    
    if(data.isAdmin){
        let newProduct = new Product({
            productName: data.product.productName,
            description: data.product.description,
            price: data.product.price,
            stocks: data.product.stocks,
        });

        return newProduct.save().then((product, error) => {
            if(error){
                return false 
            } else {
                let msg = {
                    message: `Product successfully added: ${product.productName}`
                }
                return msg
            }
        }).catch(error => console.log(error)); 
    } 
    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    })
    return msg.then(value => {
        return value;
    })
};

//Retrieve all products
module.exports.getAllProducts = () => {
    return Product.find({}).sort({"createdOn": -1}).then(result => {
        return result;
    }).catch(error => console.log(error));
};

//Retrieve all active products
module.exports.getAllActiveProducts = () => {
    return Product.find({isActive: true}).sort({"createdOn": -1}).then(result => {
        if(result == null){
            let msg = {
                response: false,
                error: "There is no product in our database.",
            };
            console.log(error);
            return msg;
        } else {
            return result;
        }
    }).catch(error => {
        let msg = {
            response: false,
            error: `Product not found.`,
        };
        console.log(error);
        return msg;
    })
};

//Retrieve a product
module.exports.getProduct = (reqParams) => {
    return Product.findById(reqParams.productId).then((result, error) => {
        if(error){
            console.log(error);
        } else {
            if(result == null){
                msg = {
                    response: false,
                    error: "Product ID does not exist."
                }
                return msg
            } else {
                return result
            }
        }
    }).catch(error => {
        let msg = {
            response: false,
            error: "Product ID does not exist.",
        };
        console.log(error);
        return msg;
    });
};

//Update a product
module.exports.updateProduct = (reqParams, data) => {
    let updatedProduct = {
        productName: data.product.productName,
        description: data.product.description,
        price: data.product.price,
        stocks: data.product.stocks,
    }
    //update the product information only if the user is admin
    if(data.isAdmin){
        return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then((product, error) => {
            if(error){
                return false;
            } else {
                if(product == null){
                    let msg = {
                        response: false,
                        message: `Product ID does not exist.`,
                    };
                    return msg;
                } else {
                    let msg = {
                        response: true,
                        message: `Successfully updated product with ID: ${reqParams.productId}`,
                        updatedProduct: updatedProduct
                    };
                    return msg;
                }
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: `Product ID does not exist.`,
            };
            console.log(error);
            return msg;
        });
    }
    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    });
    return msg.then(value => {
        return value;
    })    
};

//Archive product
module.exports.archiveProduct = (data) => {
    let updatedActiveField = {
        isActive: false
    };
    //update the isActive property to false only if the user is admin
    if(data.isAdmin){
        return Product.findByIdAndUpdate(data.productId, updatedActiveField).then((course, error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Product was not archived."
                }
                return msg;
            } else {
                let msg = {
                    response: true,
                    message: "Product successfully archived!"
                }
                return msg;
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: `Product ID does not exist.`,
            };
            console.log(error);
            return msg;
        });
    }
    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    });
    return msg.then(value => {
        return value;
    }).catch(error => console.log(error));   
};

//Add product review
module.exports.addReview = async (data) => {
    //checks if the the user purchased the product returns an array of boolean
    let productPurchased = await Order.find({userId: data.userId}).then(orderData => {
        return orderData.map(item => {
            return item.products.map(product => product.productId == data.productId);
        });
    });
    //checks if there is at least 1 "true" in the productPurchase array. returns a boolean
    let didUserPurchased = productPurchased.some(item => item.some(order => order === true));
    
    //retrieve all the reviews of the product. returns an array
    let prouductReviews = await Product.find({_id: data.productId}).then (productData => {
        return productData.map(item => {
            return item.reviews
        });
    });

    //checks if checks if the user already give a review. returns a boolean
    let didUserGaveReview = prouductReviews.some(item => item.some(review => review.userId == data.userId));

    console.log("prouductReviews: " + prouductReviews);//for testing
    console.log("productPurchased: " + productPurchased) //for testing
    console.log("didUserPurchased: " + didUserPurchased) //for testing
    console.log("didUserGaveReview: " + didUserGaveReview);//for testing
    
    //checks if the user purchased the product before they can post a review
    if(!didUserPurchased){
        let msg = {
            response: false,
            error: "User did not purchase the product."
        }
        return msg;
    
    //checks if the user already gave the review of the product since they can only review a product once.
    } else if(didUserGaveReview){
        let msg = {
            response: false,
            error: "User already gave the product a review."
        }
        return msg;

    } else {
        // return "reached the else" //for testing

        //Add product review in reviews array
        return Product.findById(data.productId).then((productData, error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Product review was not added."
                }
                console.log("Error from adding review: " + error)
                return msg;
            } else {
                let review = {
                    userId: data.userId,
                    rating: data.rating,
                    comment: data.comment   
                }
                productData.reviews.push(review);
                productData.save()
                let msg = {
                    message: "Product review added successfully!",
                    reviews: productData.reviews
                }
                return msg;
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: "Product review was not added."
            }
            console.log("Error from adding review (catch): " + error)
            return msg;
        })
    }



















    

    
}
