require('dotenv').config(); //for virtual env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();


//External Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

// Database Connection

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser : true,
	useUnifiedTopology : true
}).catch(err => console.log(err));

mongoose.connection.once('open', () => {
    console.log("Database connection successful!");
    app.listen(process.env.PORT, () => console.log(`API is now online on port ${process.env.PORT}`));
});

//middlewares
app.use(morgan('dev')); //logging middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Hello World
app.get('/', (req, res) => res.send("Hello world!"))

// Main Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/sellers", sellerRoutes);