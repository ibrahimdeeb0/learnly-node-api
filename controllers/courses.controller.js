const { body, validationResult } = require("express-validator");
const CourseModel = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");
const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (request, response) => {
  const query = request.query;
  const limit = query.limit || 10; // get limit and if there is no value set value = 10
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  // get all courses from mango db using Course Model
  const courses = await CourseModel.find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  response.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (request, response, next) => {
  const courseId = request.params.courseId;
  const course = await CourseModel.findById(courseId, { __v: false });
  if (!course) {
    const error = appError.create("course not found", 404, httpStatusText.FAIL);

    return next(error);
  }
  return response.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (request, response) => {
  const errors = validationResult(request);
  // not empty
  if (!errors.isEmpty()) {
    const err = appError.create(errors.message, 400, httpStatusText.FAIL);
    return next(err);
  }

  const newCourse = new CourseModel(request.body);
  await newCourse.save();

  response
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (request, response) => {
  const courseId = request.params.courseId;

  const updatedCourse = await CourseModel.updateOne(
    { _id: courseId },
    {
      $set: { ...request.body },
    }
  );
  return response.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { message: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (request, response) => {
  const courseId = request.params.courseId;

  await CourseModel.deleteOne({ _id: courseId });
  response.status(200).json({ status: httpStatusText.SUCCESS, data: {} });
});

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};

/* const createCourse = (request, response) => {
  console.log(request.body);

  const errors = validationResult(request);
  console.log(errors);

  // not empty
  if (!errors.isEmpty()) {
    return response.status(400).json(errors.array());
  }

  // if (!request.body.name) {
  //    return response.status(400).json({ msg: "name not provided" });
 //   }
 //   if (!request.body.price) {
 //     return response.status(400).json({ msg: "price not provided" });
 //   } 

  const course = { id: courses.length + 1, ...request.body };
  courses.push(course);

  response.status(201).json(course);
};

const createCourse = async (request, response) => {
  console.log("request body -> \n", request.body);

  const errors = validationResult(request);
  console.log("errors request -> \n", errors);
  // not empty
  if (!errors.isEmpty()) {
    return response.status(400).json(errors.array());
  }

  //   const course = { id: courses.length + 1, ...request.body };
  //   courses.push(course);

  //   response.status(201).json(course);

  const newCourse = new CourseModel(request.body);
  await newCourse.save();

  response.status(201).json(newCourse);
};

const updateCourse = (request, response) => {
  const courseId = +request.params.courseId;
  let course = courses.find((course) => course.id === courseId);

  if (!course) {
    //? "return" used for stop execution code here
    return response.status(404).json({ msg: "course not found" });
  }

  course = { ...course, ...request.body };

  response.status(200).json(course);
};

const deleteCourse = (request, response) => {
  const courseId = +request.params.courseId;
  courses = courses.filter((course) => course.id !== courseId);

  response.status(200).json({ msg: "success delete a course" });
};

const getCourse = async (request, response) => {
  const courseId = request.params.courseId;
  try {
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return response.status(404).json({
        status: httpStatusText.FAIL,
        data: { course: "course not found" },
      });
    }
    return response.json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch (error) {
    return response.status(400).json({
      status: httpStatusText.ERROR,
      data: null,
      message: error.message,
      status_code: 400,
    });
  }
};

 */

/* 
async (request, response) => {
  const courseId = request.params.courseId;
  try {
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return response.status(404).json({
        status: httpStatusText.FAIL,
        data: { course: "course not found" },
      });
    }
    return response.json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch (error) {
    return response.status(400).json({
      status: httpStatusText.ERROR,
      data: null,
      message: error.message,
      status_code: 400,
    });
  }
};
 */
