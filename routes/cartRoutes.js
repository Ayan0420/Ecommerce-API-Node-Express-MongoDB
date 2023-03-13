const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth');
const cartController = require('../controllers/cartController');

//Add to cart a product
router.post('/add-to-cart', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id,
        productId: req.body.productId,
        orderQuantity: req.body.quantity
    };

    cartController.addToCart(data).then(resultFromController => res.send(resultFromController));
});

//Retrieve all cart item
router.get('/my-cart', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id
    };

    cartController.getAllCartItems(data).then(resultFromController => res.send(resultFromController));
});

//Remove cart item
router.put('/remove-cart-items', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id,
        cartItemId: req.body.cartItem //array
    }

    cartController.removeCartItems(data).then(resultFromController => res.send(resultFromController));
});



module.exports = router;