// models/course.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
    },
    description: {
      type: String,
      default: "",
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course must have a teacher"],
    },
    category: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
