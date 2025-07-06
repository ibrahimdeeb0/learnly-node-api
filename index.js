require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();

// for serving static files like images, css, js, etc.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// const port = 5004;

const cors = require("cors");

const mongoose = require("mongoose");

const httpStatusText = require("./utils/httpStatusText");

const coursesRouter = require("./routes/course.router");

const usersRouter = require("./routes/users.router");

const rolesRouter = require("./routes/roles.router");

const contentRouter = require("./routes/content.router");

const mongo_url = process.env.MONGO_URL;
const port = process.env.PORT;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("mangodb server started");
  })
  .catch((err) => console.error("Connection error: ", err.message));

// reading response body as a JSON
app.use(cors());
app.use(express.json());

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.use("/api/users", rolesRouter);
app.use("/api/courses/:courseId/contents", contentRouter);

// global middlewares for not fount routes
app.use((req, res, next) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: "Route not found",
  });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusMessage,
    message: error.message,
    code: error.statusCode,
    data: null,
  });
});

// app.all("*", (request, response, next) => {
//   return response.status(404).json({
//     status: httpStatusText.ERROR,
//     message: "route not found",
//   });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
