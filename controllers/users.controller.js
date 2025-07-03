const asyncWrapper = require("../middlewares/asyncWrapper");
const UserModel = require("../models/user.model");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcryptjs = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (request, response) => {
  const query = request.query;
  const limit = query.limit || 10; // get limit and if there is no value set value = 10
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  // get all courses from mango db using Course Model
  const users = await UserModel.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  response.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (request, response, next) => {
  //   console.log(request.body);
  const { firstName, lastName, email, password, role } = request.body;

  const oldUser = await UserModel.findOne({ email: email });
  if (oldUser) {
    const err = appError.create(
      "email already exist",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  // password hashing
  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: request.file ? request.file.path : "uploads/profile_img.png",
  });

  // generating JWT token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  response
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { newUser } });
});

const login = asyncWrapper(async (request, response, next) => {
  const { email, password } = request.body;
  // console.log("email and password ------>. ", { email, password });

  if (!email || !password) {
    const err = appError.create(
      "email and password are required",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  const user = await UserModel.findOne({ email: email });
  // console.log("found user:", user);

  if (!user) {
    console.log("No user found with email:", email);
    const err = appError.create("user not found", 400, httpStatusText.FAIL);
    return next(err);
  }

  const matchedPassword = await bcryptjs.compare(password, user.password);

  // console.log("matched Password : ", matchedPassword);

  if (user && matchedPassword) {
    // generating JWT token
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    response.json({
      status: httpStatusText.SUCCESS,
      data: {
        id: user._id,
        email: user.email,
        token: token,
        role: user.role,
      },
    });
  } else {
    const err = appError.create(
      "email or password was wrong",
      500,
      httpStatusText.FAIL
    );
    return next(err);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
