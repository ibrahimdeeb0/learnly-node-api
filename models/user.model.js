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
    select: false, // don't return password in response
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRole.STUDENT, userRole.ADMIN, userRole.TEACHER],
    default: userRole.STUDENT,
  },
  avatar: {
    type: String,
    default: "uploads/profile_img.png",
    // "https://www.gravatar.com/avatar/0000000000000000000000000000000?d=mp&f=y",
  },
});

module.exports = mongoose.model("User", userSchema);
