const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth')
const orderController = require('../controllers/orderController');


//Create order (this code will be refactored later when we add our cart)
router.post('/check-out', auth.verify, (req, res) => {
    const data = {
        productId: req.body.productId, //this is an array data type
        userId: auth.decode(req.headers.authorization).id,
        orderQuantity: req.body.quantity 
    };

    orderController.createOrder(data).then(resultFromController => res.send(resultFromController));
})

//Retrieve user's orders
router.get('/my-orders', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id
    };

    orderController.getOrders(data).then(resultFromController => res.send(resultFromController));
});

//Retrieve all orders
router.get('/', auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };

    orderController.getAllOrders(data).then(resultFromController => res.send(resultFromController));
});


module.exports = router;