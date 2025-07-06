const express = require("express");
const router = express.Router({ mergeParams: true }); // لالتقاط :courseId
const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const userRoles = require("../utils/userRoles");
const uploadContentM = require("../middlewares/uploadFile");
const contentController = require("../controllers/content.controller");

// GET /api/courses/:courseId/contents
router.get(
  "/",
  verifyToken,
  authorizeRoles(userRoles.ADMIN, userRoles.TEACHER, userRoles.STUDENT),
  contentController.getCourseContents
);

// POST /api/courses/:courseId/contents
router.post(
  "/",
  verifyToken,
  authorizeRoles(userRoles.ADMIN, userRoles.TEACHER),
  uploadContentM.single("file"),
  contentController.uploadContent
);

// GET /api/courses/:courseId/contents/:contentId
router.get(
  "/:contentId",
  verifyToken,
  authorizeRoles(userRoles.ADMIN, userRoles.TEACHER, userRoles.STUDENT),
  contentController.getContent
);

module.exports = router;
