// Check if there is a token and header

const jwt = require("jsonwebtoken");

require('dotenv').config();

const { SECRET } = process.env;

module.exports = (req, res, next) => {
  // initialize variable 
  const token = req.headers.authorization;

  if(!token) {
    res.status(403).json({
      message: "Token Not Found. Access Denied!"
    })
  }

  if (token && token.startsWith('Bearer')){

    try {
      // get token from header
      token = token.split(' ')[1];

      // verify token
      const verifiedToken = jwt.verify(token, SECRET);

      //get user from token
      req.user = verifiedToken.user

      return next();

    } catch (error) {
      res.status(401).json({
        error: "Not Authorized"
      })
    }
  }
}


/**
 * static authenticateAdmin(request, response, next) {
    try {
      let token = request.headers.authorization;
      if (token && token.startsWith('Bearer')) {
        token = token.slice(7, token.length);
      }
      request.user = Auth.verifyToken(token);
      if (request.user.isAdmin === false) {
        return ResponseHelper.setError(response, 403, errors.notAllowed);
      }
      return next();
    } catch (error) {
      if (error.message === 'jwt expired') {
        return ResponseH
*/