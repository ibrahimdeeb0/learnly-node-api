/*

1- import mongoose-js for 
    - check valid data using schema model you created
    - save data in MongoDB
    - connected with it's collection

2- create schema model


*/
const mongoose = require("mongoose");
const validator = require("validator");
const userRole = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: [validator.isEmail, "filed must be a valid email"],
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRole.USER, userRole.ADMIN, userRole.MANAGER],
    default: userRole.USER,
  },
  avatar: {
    type: String,
    default:'uploads/profile_img.png',
      // "https://www.gravatar.com/avatar/0000000000000000000000000000000?d=mp&f=y",
  },
});

module.exports = mongoose.model("User", userSchema);
