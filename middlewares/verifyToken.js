const jwt = require("jsonwebtoken");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

const verifyToken = (request, response, next) => {
  const authHeader =
    request.headers["Authorization"] || request.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("unAuthorized", 401, httpStatusText.ERROR);
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("current User. ", currentUser);
    request.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("invalid token", 401, httpStatusText.ERROR);
    return next(error);
  }
};

module.exports = verifyToken;
