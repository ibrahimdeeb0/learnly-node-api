const mongoose = require("mongoose");
const { Schema } = mongoose;
const Course = require("./course.model");

const reviewSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Review must belong to a course"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Min rating is 1"],
      max: [5, "Max rating is 5"],
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Static method لحساب المتوسط وعدد التقييمات
reviewSchema.post("save", function () {
  Course.calcAverageRatings(this.course);
});

// Static method لحساب المتوسط وعدد التقييمات عند حذف التقييم
reviewSchema.post("remove", function () {
  Course.calcAverageRatings(this.course);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Course.calcAverageRatings(doc.course);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
