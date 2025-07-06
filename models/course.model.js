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
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Must be above 0.0"],
      max: [5, "Must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // تقريب لعشرية واحدة
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Static method لحساب المتوسط وعدد التقييمات
courseSchema.statics.calcAverageRatings = async function (courseId) {
  const stats = await this.model("Review").aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    // تطبيق التحديث مع الخيارات الجديدة
    await this.findByIdAndUpdate(
      courseId,
      {
        ratingsQuantity: stats[0].nRating,
        ratingsAverage: stats[0].avgRating,
      },
      { new: true, runValidators: true }
    );
  } else {
    // إذا ما في مراجعات
    await this.findByIdAndUpdate(
      courseId,
      {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      },
      { new: true, runValidators: true }
    );
  }
};

module.exports = mongoose.model("Course", courseSchema);
