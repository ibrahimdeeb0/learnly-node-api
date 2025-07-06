const express = require("express");
const router = express.Router({ mergeParams: true });
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const userRoles = require("../utils/userRoles");
const reviewController = require("../controllers/reviews.controller");

// GET /api/courses/:courseId/reviews
router.get(
  "/reviews",
  verifyToken,
  authorizeRoles(userRoles.ADMIN, userRoles.TEACHER, userRoles.STUDENT),
  reviewController.getCourseReviews
);

// POST /api/courses/:courseId/reviews
router.post(
  "/reviews",
  verifyToken,
  authorizeRoles(userRoles.STUDENT),
  reviewController.createReview
);

module.exports = router;
