const Product = require('../models/Product');

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
                let messages = {
                    message: `Product successfully added: ${product.productName}`
                }
                return messages
            }
        }); 
    } 
    
    let message = Promise.resolve({
        message: "User must be an admin to access this!"
    })

    return message.then(value => {
        return value;
    })
};

//Retrieve all products
module.exports.getAllProducts = () => {
    return Product.find({}).then(result => {
        return result;
    });
};

//Retrieve all active products
module.exports.getAllActiveProducts = () => {
    return Product.find({isActive: true}).then(result => {
        return result;
    })
};