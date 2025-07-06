const jwt = require("jsonwebtoken");

function generateJWT(payload) {
  // payload يجب أن يحتوي { id, role }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
}

module.exports = generateJWT;
