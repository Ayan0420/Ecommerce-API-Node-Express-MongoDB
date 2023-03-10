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

//Retrieve a user
router.get('/:userId/details', (req, res) => {
    userController.getUser(req.params).then(resultFromController => res.send(resultFromController));
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

//User add to cart
router.post('/add-to-cart', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id,
        productId: req.body.productId,
        orderQuantity: req.body.quantity
    };

    userController.addToCart(data).then(resultFromController => res.send(resultFromController));
});

module.exports = router;