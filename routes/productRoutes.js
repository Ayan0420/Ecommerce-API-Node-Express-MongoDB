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

//Retrieve a singe product
router.get('/:productId/details', (req, res) => {
    productController.getProduct(req.params).then(resultFromController => res.send(resultFromController));
});

//Update product information
router.put('/:productId/update', auth.verify, (req, res) => {
    const data = {
        product: req.body,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };

    productController.updateProduct(req.params, data).then(resultFromController => res.send(resultFromController));
});


//Archive product
router.put('/:productId/archive', auth.verify, (req, res) => {
    const data = {
        productId: req.params.productId,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };

    productController.archiveProduct(data).then(resultFromController => res.send(resultFromController));
});



//Create order (this code will be refactored later when we add our cart)
router.post('/check-out', auth.verify, (req, res) => {
    let data = {
        productId: req.body.productId,
        userId: auth.decode(req.headers.authorization).id,
        orderQuantity: req.body.quantity 
    };

    productController.createOrder(data).then(resultFromController => res.send(resultFromController));
})


module.exports = router;