const multer = require("multer");
const path = require("path");

// مجلد مستقل للمحتوى
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/content/"),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${name}-${unique}${ext}`);
  },
});

// فلتر يسمح فقط بالأنواع المطلوبة
const fileFilter = (_, file, cb) => {
  const mime = file.mimetype;
  if (mime.startsWith("video/") || mime === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only video or PDF files are allowed"), false);
  }
};

const uploadContent = multer({ storage, fileFilter });

module.exports = uploadContent;
