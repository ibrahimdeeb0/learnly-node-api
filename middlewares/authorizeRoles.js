const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

// module.exports = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.currentUser.role)) {
//       return next(appError.create("this role is not authorized", 401));
//     }
//     next();
//   };
// };

/**
 * يمرر قائمة الأدوار المسموح لها بهذه الراوت.
 * مثال: authorizeRoles("admin","teacher")
 */
function authorizeRoles(...allowed) {
  return (req, res, next) => {
    const user = req.currentUser;
    if (!user || !allowed.includes(user.role)) {
      return next(
        appError.create(
          "Forbidden: insufficient permissions",
          403,
          httpStatusText.FAIL
        )
      );
    }
    next();
  };
}

module.exports = authorizeRoles;
