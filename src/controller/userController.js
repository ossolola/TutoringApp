const Users = require("../model/userModel");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require('uuid');

const { sendEmail } = require('../utils/sendMail');

require("dotenv").config();
const {SECRET} = process.env;



// @route       POST api/auth/login
// @desc        Auth user(student, tutor, admin) and get token
// @access      Public
exports.loginUser = async (req, res) => {
    // Check for errors. That is, validate request
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        return res.status(400).json({
            statusCode: 400,
            error: errors.array()[0].msg
        })
    }
    // else
    // destructure request body

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
                id: user._id
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
                    accessToken: token
                })
            }
        )

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

// @route       POST api/student/register
// @desc        Auth user(student) and get verification email
// @access      Public 

exports.registerStudent = async (req, res) => {
    // Check for errors. Validate requests
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    try {
        // if no error exists, destructure request body
        const {firstName, lastName, email, password} = req.body;

        // check if user already exists
        const checkUser = await Users.findOne({email});

        // if user already exists in the database
        if(checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already Exists!"
            })
        };

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // if user does not already exists

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            userRole: "student"
        });

        const savedUser = await user.save();


        // send verification email
        if(user) {

            const payload = {
                user: {
                    id: user._id
                }
            };

            jwt.sign(
                payload,
                SECRET,
                {
                    expiresIn : 86000
                },
                (err, token) => {

                    if(err) {
                        throw new err
                    }

                    const url = `https://localhost:4000/user/confirm/${token}`;

                    const text = `
                        <div>
                            <h1> Email Confirmation </h1>
                            <h2> Hello ${firstName} </h2>
                            <p>Verify your email address to complete the signup and login to your account on the TutoringApp as a student</p>
                            <a href= ${url} > Click here</a>
                        </div>
                    `;

                    sendEmail({
                        email: user.email,
                        subject: "TutoringApp Account Verification",
                        message: text
                    });

                    res.status(200).json({
                        success: true,
                        message: "Account Successfully Created! Verification Email Sent!",
                        savedUser
                    });
                }
            );
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};


// @route       POST api/tutor/register
// @desc        Auth user(student) and get verification email
// @access      Public 

exports.registerTutor = async (req, res) => {
    // check for errors
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    try {
        // if no errors exist, destructure request body
        const {firstName, lastName, email, password} = req.body

        // check if user already exists
        const checkUser = await Users.findOne({email});

        // if user already exists in the database
        if(checkUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        };

        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // if user doesn't exist, 
        const user = await Users.create({
            firstName,
            lastName,
            email,
            password : hashedPassword,
            userRole: "tutor"
        });

        const savedUser = await user.save();

        // send verification
        if(user) {

            const payload = {
                user: {
                    id: user._id
                }
            };

            jwt.sign(
                payload,
                SECRET,
                {
                    expiresIn : 86000
                },
                (err, token) => {
                    if(err) {
                        throw new err
                    }

                    const url = `https://localhost:4000/user/confirm/${token}`;

                    const text = `
                        <div>
                            <h1> Email Confirmation </h1>
                            <h2> Hello ${firstName} </h2>
                            <p>Verify your email address to complete the signup and login to your account on the TutoringApp as a student</p>
                            <a href= ${url} > Click here</a>
                        </div>
                    `;

                    sendEmail({
                        email: user.email,
                        subject: "TutoringApp Account Verification",
                        message: text
                    });

                    res.status(200).json({
                        success: true,
                        message: "Account Successfully Created!",
                        savedUser
                    });
                }
            );
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};