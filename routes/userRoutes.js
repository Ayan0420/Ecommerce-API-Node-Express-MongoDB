const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth');
const userController = require('../controllers/userController');

//Register a user
router.post('/register', (req, res) => {
    userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

//Login user
router.post('/login', (req, res) => {
    userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
});

//Retrieve all users
router.get('/all', auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
    };

    userController.getAllUsers(data).then(resultFromController => res.send(resultFromController));

});

//Retrieve user details
router.get('/details', auth.verify, (req, res) => {
    let userId = auth.decode(req.headers.authorization).id
    
    userController.getUser(userId).then(resultFromController => res.send(resultFromController));
});

//Update a user
router.put('/:userId/update', auth.verify, (req, res) => {
    const data = {
       userId: req.params.userId,
       loggedUserId: auth.decode(req.headers.authorization).id,
       isAdmin: auth.decode(req.headers.authorization).isAdmin,
       reqBody: req.body
    }

    userController.updateUser(data).then(resultFromController => res.send(resultFromController));
});

//Delete a user
router.delete('/delete', auth.verify, (req, res) => {
    const data = {
        userId: req.body.userId,
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
    }

    userController.deleteUser(data).then(resultFromController => res.send(resultFromController));
});

//Set User as admin
router.post('/set-user-privileges', auth.verify, (req, res) => {
    const data = {
        userId: req.body.userId,
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
        userPrivilege: req.body.isAdmin
    };

    userController.setUserAdmin(data).then(resultFromController => res.send(resultFromController));
})

module.exports = router;