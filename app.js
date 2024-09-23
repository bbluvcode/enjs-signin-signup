var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://bbluvcode:admin123@cluster0.4opwr.mongodb.net/demo?retryWrites=true&w=majority&appName=Cluster0"
);

const store = new MongoDBStore({
  uri: "mongodb+srv://bbluvcode:admin123@cluster0.4opwr.mongodb.net/demo?retryWrites=true&w=majority&appName=Cluster0", 
  collection: "sessions",
})

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
    store: store,
  })
);

app.use((req, res, next) => {
  if (req.session.username !== undefined && (req.originalUrl !== "/home") && (req.originalUrl !== "/logout") ) {
    return res.redirect("/home");
  }
  next();
});

app.use("/", indexRouter);
app.use("/signup", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
