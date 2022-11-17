/**
 * 1. Creating a connection function for mongodb
 * 2. Start a cloud mongodb server connection
*/

const mongoose = require("mongoose");

require("dotenv").config();

// Create the connection function
const  connectDB = async () => {

    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

    try {
        mongoose.connect(process.env.MONGO_URI, connectionParams)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Connection Failed")

        //exit with failure
        process.exit(1);
    }
}


module.exports = connectDB;