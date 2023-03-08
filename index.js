const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

//External Routes
const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');

//connect to our database
mongoose.connect('mongodb://zuitt-bootcamp:password12345@ac-sttbgzp-shard-00-00.vgg4yb3.mongodb.net:27017,ac-sttbgzp-shard-00-01.vgg4yb3.mongodb.net:27017,ac-sttbgzp-shard-00-02.vgg4yb3.mongodb.net:27017/ecommerce-api-capstone2?ssl=true&replicaSet=atlas-6bcz5h-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser : true,
	useUnifiedTopology : true
}).catch(err => console.log(err));
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas!"));

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors()); //cross origin resource sharing to allow this application to access resources from other apis


// Main Routes
app.use("/users", userRoutes);
// app.use("/products", productRoutes);

app.listen(port, () => console.log(`API is now online on port ${port}`));