const asyncWrapper = require("../middlewares/asyncWrapper");
const ReviewModel = require("../models/review.model");
const CourseModel = require("../models/course.model");
const UserModel = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

// إضافة مراجعة جديدة
const createReview = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const courseId = req.params.courseId;
  const { rating, comment } = req.body;

  // تأكد أن الكورس موجود
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  // تحقق أن الطالب مشترك في الكورس
  const user = await UserModel.findById(userId);
  if (!user.enrolledCourses.includes(courseId)) {
    return next(
      appError.create(
        "Cannot review a course you did not enroll in",
        403,
        httpStatusText.FAIL
      )
    );
  }

  // تحقق من عدم وجود مراجعة سابقة لهذا المستخدم وهذه الدورة
  const existing = await ReviewModel.findOne({
    course: courseId,
    user: userId,
  });
  if (existing) {
    return next(
      appError.create(
        "You have already reviewed this course",
        400,
        httpStatusText.FAIL
      )
    );
  }

  // أنشئ المراجعة
  const review = await ReviewModel.create({
    course: courseId,
    user: userId,
    rating,
    comment: comment || "",
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: review,
  });
});

// جلب كل المراجعات لكورس
const getCourseReviews = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const reviews = await ReviewModel.find({ course: courseId })
    .populate("user", "firstName lastName avatar")
    .sort("-createdAt");
  res.json({
    status: httpStatusText.SUCCESS,
    data: reviews,
  });
});

module.exports = {
  createReview,
  getCourseReviews,
};
