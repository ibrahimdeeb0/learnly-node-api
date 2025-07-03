const express = require("express");
const multer = require("multer");

const appError = require("../utils/appError");

const router = express.Router();

const diskStorage = multer.diskStorage({
  // This is used to store the uploaded files on the server
  destination: (request, file, callBack) => {
    // console.log("FILE", file);
    callBack(null, "uploads/");
  },
  filename: (request, file, callBack) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callBack(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter: fileFilter });

const userController = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken");

router.route("/").get(verifyToken, userController.getAllUsers);
router
  .route("/register")
  .post(upload.single("avatar"), userController.register);
router.route("/login").post(userController.login);

module.exports = router;
