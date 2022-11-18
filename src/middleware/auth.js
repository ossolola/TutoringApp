// Check if there is a token and header

const jwt = require("jsonwebtoken");

require('dotenv').config();

const { SECRET } = process.env;

module.exports = (req, res, next) => {
    // get token from header
    const token = req.header("x-auth-token");

    //Check if token doesn't exist
    if(!token) {
        return res.status(401).json({
            statusCode: 401,
            message: "No token, authorization denied!"
        })
    }

    //else
    //token exists
    try {
        const decoded = jwt.verify(token, SECRET);

        // Assign user to request object
        req.user = decoded.user
        next();

    } catch (error) {
        res.status(401).json({
            statusCode: 401,
            message: "Token is not valid"
        })
    }
}