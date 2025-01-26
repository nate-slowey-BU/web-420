/* 
Name: Nate Slowey
Date: 1/26/25
File Name: app.js
Description:
*/

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/user');

var app = express();

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "landing-page.html"));
});

app.get('/test500', (req, res) => {
  throw new Error('This is a 500 test error!');
});

app.use(express.static(path.join(__dirname, "public")));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use('/users', usersRouter);

// catch 500
app.use((err, req, res, next) => {
  //Log the error stack in development mode
  if (process.env.NODE_ENV === 'development') {
      console.error(err.stack);  // Logs the error stack for debugging
  }

  // Prepare the error response
  const errorResponse = {
      message: 'Something went wrong on our end. Please try again later.',
      error: err.message || 'Unknown error'
  };

  // Send the JSON response with a 500 status code
  res.status(500).json(errorResponse);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
	res.status(404).send(`
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    `);
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
