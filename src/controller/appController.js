const Users = require("../model/User");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const userModel = require("../model/User");

require("dotenv").config();
const {SECRET} = process.env;



// @route       POST api/auth/login
// @desc        Auth user(student, tutor, admin) and get token
// @access      Public
exports.loginUser = async (req, res) => {
    // Check for errors
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            error: errors.array()
        })
    }
    //else
    //destructure request body

    const {email, password} = req.body;

    try {
        //Initialize user
        let user = await Users.findOne({email});

        if(!user) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid Credentials"
            })
        }

        // else
        //Check for password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid Credentials"
            })
        }

        // else
        // if there's a match, send token 
        // send payload and signed token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            SECRET,
            {
                expiresIn: 360000
            },
            (err, token) => {
                if(err) {
                    throw err
                }
                res.status(200).json({
                    message: "logged in successfully",
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        userRole: user.userRole,
                        isTutor: user.isTutor,
                        isAdmin: user.isAdmin
                    },
                    token
                })
            }
        );
    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            message: "Internal server error"
        })
    }
}


// @route       GET api/auth
// @desc        Auth user(student, tutor, admin) and get token
// @access      Public 
// Get Logged in User
exports.getLoggedInUser = async (req, res) => {
    try {
        // Get User from DB
        const user = await Users.findById(req.user.id).select("password");

        //return User
        res.status(200).json({
            statusCode: 200,
            message: "User gotten successfully",
            user
        })
    } catch (error) {
        console.error(error.message)

        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

