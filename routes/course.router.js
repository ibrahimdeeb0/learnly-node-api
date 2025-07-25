const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const userRoles = require("../utils/userRoles");
const courseController = require("../controllers/courses.controller");
const { validationSchema } = require("../middlewares/validationSchema");
 
router
  .route("/")
  .get(verifyToken, courseController.getAllCourses)
  .post(
    verifyToken,
    authorizeRoles(userRoles.ADMIN, userRoles.TEACHER),
    validationSchema(),
    courseController.createCourse
  );

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN, userRoles.TEACHER),
    validationSchema(true),
    courseController.updateCourse
  )
  .delete(
    verifyToken,
    authorizeRoles(userRoles.ADMIN, userRoles.TEACHER),
    courseController.deleteCourse
  );

router
  .route("/:courseId/enroll")
  .post(
    verifyToken,
    authorizeRoles(userRoles.STUDENT),
    courseController.enrollInCourse
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
