const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/authorizeRoles");
const userRoles = require("../utils/userRoles");
const userController = require("../controllers/users.controller");

// فقط الأدمن يمكنه تعديل دور المستخدم
router
  .route("/:id/role")
  .patch(
    verifyToken,
    authorizeRoles(userRoles.ADMIN, userRoles.TEACHER),
    userController.changeUserRole
  );

module.exports = router;
