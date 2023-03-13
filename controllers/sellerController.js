//Database models
const User = require('../models/User');
const Product = require('../models/Product')
const Seller = require('../models/Seller')

//Set user as seller
module.exports.switchUserToSeller = async (data) => {

    //checks if user already registered as seller
    let isSellerExists = await Seller.exists({userId: data.userId}).then((result, error) => {
        if(error){
            console.log(error);
            return false;
        } else {
            return result
        }
    });


    if(data.isAdmin){
        if(isSellerExists == null){
            let newSeller = new Seller({
                sellerName: data.sellerName,
                userId: data.userId,
                products: [],
            });
    
            return newSeller.save().then((sellerData, error) => {
                if(error){
                    let msg = {
                        response: false,
                        error: "Failed saving newSeller.",
                    };
                    console.log(error);
                    return msg;
                } else {

                    User.findById(data.userId).then(userData => {
                        userData.isSeller = true;
                        userData.save();
                    });

                    let msg = {
                        response: true,
                        message: "Seller successfully registered!",
                        sellerInfo: sellerData
                    };
                    return msg;
                }
            }).catch(error => {
                let msg = {
                    response: false,
                    error: "Failed saving newSeller.",
                };
                console.log(error);
                return msg;
            });

        } else {
            let msg = {
                response: false,
                error: "Seller is already registered"
            }
            return msg
        }
    } 

    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    })
    return msg.then(value => {
        return value;
    })
};

//Retrieve all sellers
module.exports.getAllSellers = () => {
    return Seller.find({}).populate({path: "userId", select: ["firstName", "lastName", "email", "address", "mobileNo"]}).then(sellerData => sellerData).catch(error => {
        let msg = {
            response: false,
            error: "Failed retrieving all sellers.",
        };
        console.log(error);
        return msg;
    })
};

//Retrieve seller details //LAST PROGRESS
module.exports.getSeller = (data) => {

}