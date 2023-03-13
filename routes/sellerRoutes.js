const express = require('express');
const router = express.Router();

//Controllers
const auth = require('../auth');
const sellerController = require('../controllers/sellerController');

//Set user as seller
router.post('/register-seller', auth.verify, (req, res) => {
    const data = {
        sellerName: req.body.sellerName,
        userId: req.body.userId,
        isAdmin: auth.decode(req.headers.authorization).isAdmin
    };

    sellerController.switchUserToSeller(data).then(resultFromController => res.send(resultFromController));
});

//retrieve all sellers
router.get('/all', (req, res) => {
    sellerController.getAllSellers().then(resultFromController => res.send(resultFromController));
});

//Retrieve seller details //LAST PROGRESS

module.exports = router;