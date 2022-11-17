/**
 * 1. Creating an express server
 * 2. Connect to mongodb
 * 3. Initialize express
 * 4. Initialize express middleware
 * 5. inject our routes
 * 6. listen to our app connection
*/

const express = require("express");

const {json} = require("express");

const connectDB = require ("./config/database");

require("dotenv").config();

//connect to db
connectDB();

//Initialize express
const app = express();

//initialize express middleware
app.use(json());

// 
app.get('/', (req, res) => {
    res.status(200).json({
        message: "App Running Perfectly and Transmitting"
    })
} )


//PORT
const PORT = process.env.PORT

//Listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});