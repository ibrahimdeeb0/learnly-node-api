const { body, validationResult } = require("express-validator");
const CourseModel = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const UserModel = require("../models/user.model");

// GET /api/courses? page & limit & q(search) & category
const getAllCourses = asyncWrapper(async (req, res) => {
  const { page = 1, limit = 10, q, category } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;
  const courses = await CourseModel.find(filter)
    .populate("teacher", "firstName lastName email")
    .skip(skip)
    .limit(Number(limit));

  const total = await CourseModel.countDocuments(filter);
  res.json({
    status: httpStatusText.SUCCESS,
    data: { total, page: Number(page), limit: Number(limit), courses },
  });
});

// GET /api/courses/:courseId
const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.courseId).populate(
    "teacher",
    "firstName lastName email"
  );
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }
  res.json({ status: httpStatusText.SUCCESS, data: course });
});

// POST /api/courses
const createCourse = asyncWrapper(async (req, res) => {
  // teacher من الـ JWT middleware
  const teacherId = req.currentUser.id;
  const { name, description, category, price, isPublished } = req.body;

  const course = await CourseModel.create({
    name,
    description,
    category,
    price: Number(price),
    isPublished: !!isPublished,
    teacher: teacherId,
  });

  res.status(201).json({ status: httpStatusText.SUCCESS, data: course });
});

// PATCH /api/courses/:courseId
const updateCourse = asyncWrapper(async (req, res, next) => {
  const updates = { ...req.body };
  // لا نسمح بتغيير المعلم بعد الإنشاء:
  delete updates.teacher;

  const course = await CourseModel.findByIdAndUpdate(
    req.params.courseId,
    updates,
    { new: true, runValidators: true }
  );
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }
  res.json({ status: httpStatusText.SUCCESS, data: course });
});

// DELETE /api/courses/:courseId
const deleteCourse = asyncWrapper(async (req, res, next) => {
  const course = await CourseModel.findByIdAndDelete(req.params.courseId);
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }
  res.json({ status: httpStatusText.SUCCESS, data: { id: course._id } });
});

// POST /api/courses/:courseId/enroll
const enrollInCourse = asyncWrapper(async (req, res, next) => {
  const userId = req.currentUser.id;
  const courseId = req.params.courseId;

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  const user = await UserModel.findById(userId);
  if (user.enrolledCourses.includes(courseId)) {
    return next(appError.create("Already enrolled", 400, httpStatusText.FAIL));
  }

  user.enrolledCourses.push(courseId);
  await user.save();

  res.json({
    status: httpStatusText.SUCCESS,
    data: { message: "Enrolled successfully", courseId },
  });
});

// GET /api/courses/my-courses
const getMyCourses = asyncWrapper(async (req, res) => {
  const user = await UserModel.findById(req.currentUser.id).populate({
    path: "enrolledCourses",
    select: "name description price isPublished teacher",
    populate: { path: "teacher", select: "firstName lastName email" },
  });
  if (!user) {
    return res.status(404).json({
      status: httpStatusText.FAIL,
      message: "User not found",
    });
  }
  res.json({
    status: httpStatusText.SUCCESS,
    data: { courses: user.enrolledCourses || [] },
  });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getMyCourses,
};
