const express = require("express");

const router = express.Router();

const { check } = require("express-validator");

const auth = require("../middleware/auth");

// Import Controller
const userController = require("../controller/userController");

// Login User route
router.post(
  "/auth/login",
  [
    check("email", "please enter a valid email address").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  userController.loginUser
);

// Get loggeed In user
router.get('/', auth, userController.getLoggedInUser);

// register student route
router.post(
  '/student/register', 
  [
    check("email", "Please Enter a valid password").isEmail(),
    check("firstName", "firstName must have a minimum of four characters").exists().isLength({ min: 4}),
    check("lastName", "firstName must have a minimum of four characters").exists().isLength({ min: 4}),
    check("password", "Password required and must have a minimum of 8 characters").exists().isLength({ min : 8 })
  ],
  userController.registerStudent
);

// register tutor route
router.post(
  '/tutor/register', 
  [
    check("email", "Please Enter a valid password").isEmail(),
    check("firstName", "firstName must have a minimum of four characters").exists().isLength({ min: 4}),
    check("lastName", "firstName must have a minimum of four characters").exists().isLength({ min: 4}),
    check("password", "Password required and must have a minimum of 8 characters").exists().isLength({ min : 8 })
  ],
  userController.registerTutor
);

module.exports = router;
