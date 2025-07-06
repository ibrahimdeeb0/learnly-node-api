const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema(
  {
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
      validate: [validator.isEmail, "Must be a valid email"],
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
      enum: Object.values(userRoles),
      default: userRoles.STUDENT,
    },
    avatar: {
      type: String,
      default: "uploads/profile_img.png",
      // "https://www.gravatar.com/avatar/0000000000000000000000000000000?d=mp&f=y",
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
