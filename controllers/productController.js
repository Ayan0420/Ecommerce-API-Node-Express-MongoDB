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
    return Product.find({}).then(result => {
        return result;
    }).catch(error => console.log(error));
};

//Retrieve all active products
module.exports.getAllActiveProducts = () => {
    return Product.find({isActive: true}).then(result => {
        return result;
    }).catch(error => console.log(error))
};

//Retrieve a product
module.exports.getProduct = (reqParams) => {
    return Product.findById(reqParams.productId).then((result, error) => {
        if(error){
            console.log(error);
        } else {
            if(result == null){
                msg = {
                    error: "Product not found"
                }
                return msg
            } else {
                return result
            }
        }
    }).catch(error => {
        let msg = {
            response: false,
            message: `Product ID does not exist.`,
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
                message: `Product ID does not exist.`,
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
                message: `Product ID does not exist.`,
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
