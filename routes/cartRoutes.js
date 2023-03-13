const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth');
const cartController = require('../controllers/cartController');

//User add to cart
router.post('/add-to-cart', auth.verify, (req, res) => {
    const data = {
        userId: auth.decode(req.headers.authorization).id,
        productId: req.body.productId,
        orderQuantity: req.body.quantity
    };

    cartController.addToCart(data).then(resultFromController => res.send(resultFromController));
});

module.exports = router;