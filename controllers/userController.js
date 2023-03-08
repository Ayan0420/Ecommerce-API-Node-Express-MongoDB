const User = require('../models/User');
// const Product = require('../models/Product')
const bcrypt = require('bcrypt');
const auth = require('../auth');


//register a user
module.exports.registerUser = (reqBody) => {
    let newUser = new User({
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        email: reqBody.email,
        mobileNo: reqBody.mobileNo,
        password: bcrypt.hashSync(reqBody.password, 10), // to encrypt the password
        cartItems: []
    });

    return newUser.save().then((user, error) => {
        if(error) {
            messages = {
                message: "There is an error registering user"
            }
            console.log(error)
            return messages
        } else {
            messages = {
                message: `Successfully added user ${user.firstName} ${user.lastName}`
            }
            return messages
        };
    });
};

//login a user
module.exports.loginUser = (reqBody) => {

    return User.findOne({email: reqBody.email}).then(userData => {
        if(userData == null){
            return false
        } else {
            const isPasswordCorrect = bcrypt.compareSync(reqBody.password, userData.password);

            if(isPasswordCorrect){
                
                return {
                    message: "login successfull",
                    accessToken: auth.createAccessToken(userData)
                }
            } else {
                return false
            }
        }
    });
};