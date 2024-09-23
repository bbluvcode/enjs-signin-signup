var express = require("express");
var router = express.Router();
const userModel = require("../model/user");
const { body, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login",
  [
    body("username")
      .notEmpty()
      .withMessage("Input Username please!")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("login", {
        e: errors.array()[0].msg,
        username: req.body.username,
      });
    }

    console.log(req.body);

    const validUser = await userModel.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (!validUser) {
      return res.render("login", { e: "Incorrect username or password" });
    } else {
      req.session.username = req.body.username;
      if (req.body.accept === "on") {
        req.session.cookie.maxAge = 600000;
      }
      return res.redirect("/home");
    }
  }
);

router.get("/home", (req, res, next) => {
  if (req.session.username === undefined) {
    return res.redirect("/");
  }
  return res.render("home", { username: req.session.username });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
