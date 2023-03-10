const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth')
const orderController = require('../controllers/orderController');


//Create order (this code will be refactored later when we add our cart)
router.post('/check-out', auth.verify, (req, res) => {
    let data = {
        productId: req.body.productId,
        userId: auth.decode(req.headers.authorization).id,
        orderQuantity: req.body.quantity 
    };

    orderController.createOrder(data).then(resultFromController => res.send(resultFromController));
})


module.exports = router;