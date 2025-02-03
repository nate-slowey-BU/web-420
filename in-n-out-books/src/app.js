/*
Name: Nate Slowey
Date: 1/26/25
File Name: app.js
Description:
*/

const createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("../routes/index");
const books = require("../database/books");
// var usersRouter = require('./routes/user');

var app = express();

const rootDir = path.resolve(__dirname, '..');  // Navigate one level up to the root

app.use(express.static(path.join(rootDir, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join("/Users/nate/buwebdev/web-420/in-n-out-books", "views", "landing-page.html"));
});

app.get("/test500", (req, res) => {
  throw new Error("This is a 500 test error!");
});

app.get("/api/books", async (req, res, next) => {
  try {
    const allBooks = await books.find();
    console.log("Books:", books);
    res.send(allBooks);
  } catch (err) {
    console.error("Error:", err.message);
    next(err);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Input must be a number",
      });
    }

    const book = await books.findOne({ id: Number(req.params.id) });
    console.log("Book: ", book);
    res.send(book);
  } catch {
    console.error("Error fetching book:", err.message);
    next(err);
  }
});



// view engine setup
app.set("views", path.join(rootDir, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/", indexRouter);
// app.use('/users', usersRouter);

// catch 500
app.use((err, req, res, next) => {
  //Log the error stack in development mode
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack); // Logs the error stack for debugging
  }

  // Prepare the error response
  const errorResponse = {
    message: "Something went wrong on our end. Please try again later.",
    error: err.message || "Unknown error",
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
