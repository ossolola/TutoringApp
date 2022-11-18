const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/auth");

// Import Controller
const appController = require("../controller/appController");

// Login User route
router.post(
  "/api/auth/login",
  [
    check("email", "please enter a valid email address").isEmail(),
    check("password", "A valid password is required").exists(),
  ],
  appController.loginUser
);

// Get loggeed In user
router.get('/api/auth', auth, appController.getLoggedInUser);

module.exports = router;
