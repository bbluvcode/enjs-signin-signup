var express = require("express");
var router = express.Router();
const userModel = require("../model/user");
const { body, validationResult } = require("express-validator");

//==========>SIGN UP<==========
router.get("/", function (req, res) {
  res.render("register", { username: "", email: "" });
});

router.post(
  "/",
  [
    body("username")
      .notEmpty()
      .withMessage("Input Username please!")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .custom(async (value) => {
        const existed = await userModel.findOne({ username: value });
        if (existed) {
          throw new Error("User is existed. Please input other user!.");
        }
      }),
    body("email")
      .notEmpty()
      .withMessage("Input email please!")
      .isEmail()
      .withMessage("Email form wrong")
      .custom(async (value) => {
        const existed = await userModel.findOne({ email: value });
        if (existed) {
          throw new Error("Email is existed. Please input other email!.");
        }
      }),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long"),
    body("repassword").notEmpty().withMessage("Confirm password please!"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", {
        e: errors.array()[0].msg,
        username: req.body.username,
        email: req.body.email,
      });
    }

    let checkpw = req.body.password === req.body.repassword;
    if (!checkpw) {
      return res.render("register", {
        e: "Repassword is wrong",
        username: req.body.username,
        email: req.body.email,
      });
    }

    let acceptCheckbox = req.body.accept;
    if (!acceptCheckbox) {
      return res.render("register", {
        e: "You must accept the terms and conditions before signing up.",
        username: req.body.username,
        email: req.body.email,
      });
    }

    try {
      const user = await userModel.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
      res.redirect("/?signup=success");
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
//==========>END SIGN UP<==========

module.exports = router;
