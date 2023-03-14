const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth')
const productController = require('../controllers/productController');

//Add products as admin
router.post('/add-product-admin', auth.verify, (req, res) => {
    const data = {
        product: req.body,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };
    
    productController.addProductAsAdmin(data).then(resultFromController => res.send(resultFromController));
});

//Add products as seller
router.post('/add-product-seller', auth.verify, (req, res) => {
    const data = {
        product: req.body,
        userId: auth.decode(req.headers.authorization).id
    };
    console.log("req.body.productName: " + req.body.productName)
    productController.addProductAsSeller(data).then(resultFromController => res.send(resultFromController));
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

//Add product review
router.post('/:productId/add-review', auth.verify, (req, res) => {
    const data = {
        productId: req.params.productId,
        userId: auth.decode(req.headers.authorization).id,
        rating: req.body.rating,
        comment: req.body.comment
    }

    productController.addReview(data).then(resultFromController => res.send(resultFromController));
});


module.exports = router;