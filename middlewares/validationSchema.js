const { body } = require("express-validator");

const validationSchema = () => [
  body("name")
    .notEmpty()
    .withMessage("title not provided")
    .isLength({ min: 2 })
    .withMessage("name at least two digits"),

  body("price").notEmpty().withMessage("price is required"),
];

module.exports = {
  validationSchema,
};
