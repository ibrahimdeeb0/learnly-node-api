const path = require("path");
const asyncWrapper = require("../middlewares/asyncWrapper");
const ContentModel = require("../models/content.model");
const CourseModel = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");

// رفع محتوى جديد
const uploadContent = asyncWrapper(async (req, res, next) => {
  const { courseId } = req.params;
  const file = req.file;
  const { title, type, order } = req.body;

  // تأكد من وجود الكورس
  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(appError.create("Course not found", 404, httpStatusText.FAIL));
  }

  if (!file) {
    return next(appError.create("File is required", 400, httpStatusText.FAIL));
  }

  const content = await ContentModel.create({
    course: courseId,
    title,
    type,
    url: `/uploads/content/${file.filename}`,
    order: order || 0,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: content,
  });
});

// جلب كل المحتويات لكورس
const getCourseContents = asyncWrapper(async (req, res) => {
  const contents = await ContentModel.find({ course: req.params.courseId })
    .sort("order")
    .select("-__v");
  res.json({
    status: httpStatusText.SUCCESS,
    data: contents,
  });
});

// جلب محتوى واحد (للتضمين أو التحميل)
// ويمكن إضافة منطق للتحقق إن الطالب مشترك مثلاً
const getContent = asyncWrapper(async (req, res, next) => {
  const content = await ContentModel.findById(req.params.contentId);
  if (!content) {
    return next(appError.create("Content not found", 404, httpStatusText.FAIL));
  }
  // stream أو إرسال الملف مباشرة
  const filePath = path.join(__dirname, "..", content.url);
  res.sendFile(filePath);
});

module.exports = {
  uploadContent,
  getCourseContents,
  getContent,
};
