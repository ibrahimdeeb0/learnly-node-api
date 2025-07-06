// models/content.model.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const contentSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Each content must belong to a course"],
    },
    title: {
      type: String,
      required: [true, "Content title is required"],
    },
    type: {
      type: String,
      enum: ["video", "pdf", "quiz"],
      required: [true, "Content type is required"],
    },
    url: {
      type: String,
      required: [true, "File URL is required"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Content", contentSchema);
