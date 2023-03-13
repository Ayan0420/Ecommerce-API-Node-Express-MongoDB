const bcrypt = require('bcrypt');
const auth = require('../auth');
//Database models
const User = require('../models/User');
const Product = require('../models/Product')
const Seller = require('../models/Seller')


//register a user
module.exports.registerUser = async (reqBody) => {

    let isUserExists = await User.exists({email: reqBody.email}).then((result, error) => {
        if(error){
            console.log(error);
            return false;
        } else {
            return result
        }
    });

    console.log(isUserExists)

    if(isUserExists == null){
        let newUser = new User({
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            mobileNo: reqBody.mobileNo,
            address: reqBody.address,
            password: bcrypt.hashSync(reqBody.password, 10), // to encrypt the password
            cartItems: []
        });
    
        return newUser.save().then((userData, error) => {
            if(error) {
                let msg = {
                    response: false,
                    error: "There is an error registering user"
                }
                console.log(error)
                return msg
            } else {
                let msg = {
                    message: `Successfully added user ${userData.firstName} ${userData.lastName}`,
                    userData: {
                        id: userData._id,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        mobileNo: userData.mobileNo,
                        address: userData.address,
                    }
                }
                return msg
            };
        }).catch(error => {
            let msg = {
                response: false,
                error: "There was an error registering user"
            }
            console.log(error)
            return msg
        });
    } else {
        let msg = {
            response: false,
            error: "Email address is already registered"
        }
        return msg
    }

    
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

//Retrive all users
module.exports.getAllUsers = (data) => {
    if(data.isAdmin){
        return User.find({}).sort({"_id": -1}).then((usersData, error) => {
            if(error){
                let msg = {
                    response: false,
                    error: "Error obtaining users.",
                    };
                console.log("error from get all users: " + error);
                return msg
            } else {
                let data = []; 
                usersData.forEach(item => {
                    let userData = {
                        _id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        email: item.email,
                        password: "",
                        isAdmin: item.isAdmin,
                        mobileNo: item.mobileNo,
                        cartItems: item.cartItems,
                    }
                    data.push(userData)
                });

                return data
            }
        })
    }

    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    })
    return msg.then(value => {
        return value;
    })
};

//Retrieve a user
module.exports.getUser = (reqParams, isAdmin) => {

    return User.findById(reqParams.userId).then((userData, error) => {
        if(error){
            let msg = {
                message: "User ID does not exist."
            }
            console.log(error)
            return msg
        } else {
            if(userData == null){
                let msg = {
                    message: "User ID does not exist."
                }
                console.log(error)
                return msg
            } else if(isAdmin != null && isAdmin){
                let data = userData;
                data.password = "";
                
                return data;
            } else {
                let data = {
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    mobileNo: userData.mobileNo,
                    address: userData.address
                }
                return data;
            }

            
        }
    }).catch(error => {
        let msg = {
            message: "User ID does not exist."
        }
        console.log(error)
        return msg
    });
};

//Update a user
module.exports.updateUser = (data) => {
    let updatedUser = {
        firstName: data.reqBody.firstName,
        lastName: data.reqBody.lastName,
        email: data.reqBody.email,
        mobileNo: data.reqBody.mobileNo,
        address: data.reqBody.address
    }

    //if the admin is the one updating, he can do so to all users, but if the user is not admin, the logged user must be equal to the user being updated for it to continue.
    if(data.isAdmin || data.loggedUserId == data.userId){
        return User.findByIdAndUpdate(data.userId, updatedUser).then((result, error) => {
            if(error){
                console.log("Error from finddeletedUser and delete: " + error);
            } else {
                let msg = {
                    message: "User successfully updated!",
                    updatedUserInfo: {
                        id: result._id,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        email: updatedUser.email,
                        mobileNo: updatedUser.mobileNo,
                        address: updatedUser.address,

                    }
                };
                return msg;
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: `User ID does not exist.`,
            };
            console.log(error);
            return msg;
        });
    }

    //If the user is not an admin or userId didn't match the logged user
    let msg = Promise.resolve({
        response: false,
        error: "You can only update your own information or you must be an admin to update this user!"
    })
    return msg.then(value => {
        return value;
    })
}

//Delete a user
module.exports.deleteUser = (data) => {
    if(data.isAdmin){
        return User.findByIdAndDelete(data.userId).then((result, error) => {
            if(error){
                console.log("Error from find and delete: " + error);
            } else if(result == null) {
                let msg = {
                    response: false,
                    error: "User ID does not exist.",
                    };
                return msg;
            } else {
                let msg = {
                    message: "User successfully deleted!",
                    deletedUser: result
                    };
                return msg;
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: `User ID does not exist.`,
            };
            console.log(error);
            return msg;
        });
    }

    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    })
    return msg.then(value => {
        return value;
    })
};

//Set user as admin
module.exports.setUserAdmin = (data) => {
    if(data.isAdmin){
        //to retrieve user data  
        return User.findById(data.userId).then((userData, error) => {
            if(error){
                console.log("Error from finding user data: " + error); 
            } else if(userData == null) {
                let msg = {
                    response: false,
                    error: "User ID does not exist.",
                    };
                return msg;
            } else {
                //reassign the value of the isAdmin from the indicated userPrivilege
                userData.isAdmin = data.userPrivilege;
                return userData.save().then((userData, error) => {
                    if(error){
                        console.log("Error from saving user data: " + error)
                    } else {
                        
                        let msg = {
                            response: true,
                            message: `User ${userData.email} is set to ${userData.isAdmin == true ? "Admin" : "Non-admin"}.`,
                            };
                        return msg;
                    }
                }); 
            }
        }).catch(error => {
            let msg = {
                response: false,
                error: `User ID does not exist.`,
            };
            console.log(error);
            return msg;
        });
    } 
    
    //If the user is not an admin
    let msg = Promise.resolve({
        error: "User must be an admin to access this!"
    })
    return msg.then(value => {
        return value;
    })
};



