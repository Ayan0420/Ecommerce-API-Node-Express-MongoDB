const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth')
const productController = require('../controllers/productController');

//Add products
router.post('/', auth.verify, (req, res) => {
    const data = {
        product: req.body,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };
    
    productController.addProduct(data).then(resultFromController => res.send(resultFromController));
});

//Retrieve all products
router.get('/all', (req, res) => {
    productController.getAllProducts().then(resultFromController => res.send(resultFromController));
});

//Retrieve all active products
router.get('/active', (req, res) => {
    productController.getAllActiveProducts().then(resultFromController => res.send(resultFromController));
});


module.exports = router;