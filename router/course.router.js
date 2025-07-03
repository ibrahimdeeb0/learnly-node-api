const express = require("express");

const router = express.Router();

const courseController = require("../controllers/courses.controller");
const { validationSchema } = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/userRoles");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(validationSchema(), courseController.createCourse);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    courseController.deleteCourse
  );

module.exports = router;

/*
--> Old code <--

router.get("/", courseController.getAllCourses);

router.post(
  "/",
    // body("name")
    // .notEmpty()
    // .withMessage("title not provided")
    // .isLength({ min: 2 })
    // .withMessage("name at least two digits"), 
  [
    body("name")
      .notEmpty()
      .withMessage("title not provided")
      .isLength({ min: 2 })
      .withMessage("name at least two digits"),

    body("price").notEmpty().withMessage("price is required"),
  ],
  courseController.createCourse
);

router.get("/:courseId", courseController.getCourse);

router.patch("/:courseId", courseController.updateCourse);

router.delete("/:courseId", courseController.deleteCourse);

*/
