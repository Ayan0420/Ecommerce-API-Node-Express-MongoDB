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

module.exports = router;