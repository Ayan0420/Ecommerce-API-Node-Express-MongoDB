const bcrypt = require('bcrypt');
const auth = require('../auth');
//Database models
const User = require('../models/User');
// const Product = require('../models/Product')


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

    return newUser.save().then((userData, error) => {
        if(error) {
            let msg = {
                message: "There is an error registering user"
            }
            console.log(error)
            return msg
        } else {
            let msg = {
                message: `Successfully added user ${userData.firstName} ${userData.lastName}`
            }
            return msg
        };
    }).catch(error => {
        let msg = {
            message: "There was an error registering user"
        }
        console.log(error)
        return msg
    });
};

//login a user
module.exports.loginUser = (reqBody) => {

    return User.findOne({email: reqBody.email}).then(userData => {
        if(userData == null){
            let msg = {
                error: "email or password is incorrect",
                accessToken: null
            }
            return msg
        } else {
            const isPasswordCorrect = bcrypt.compareSync(reqBody.password, userData.password);

            if(isPasswordCorrect){
                let msg = {
                    message: "Login successfull!",
                    accessToken: auth.createAccessToken(userData)
                }
                return msg
            } else {
                let msg = {
                    error: "email or password is incorrect",
                    accessToken: null
                }
                return msg
            }
        }
    }).catch(error => {
        let msg = {
            message: "There was an error logging-in the user"
        }
        console.log(error)
        return msg
    });
};

//Retrieve a user
module.exports.getUser = (reqParams) => {

    return User.findById(reqParams.userId).then((userData, error) => {
        if(error){
            let msg = {
                message: "User ID does not exist."
            }
            console.log(error)
            return msg
        } else {
            let data = {
                id: userData.id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                mobileNo: userData.mobileNo
            }

            return data
        }
    }).catch(error => {
        let msg = {
            message: "User ID does not exist."
        }
        console.log(error)
        return msg
    });
}