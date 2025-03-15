const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')

app = express();
PORT = 3000;

const booksRouter = require("./routes/books");
const reviewsRouter = require("./routes/reviews");
const usersRouter = require("./routes/users");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use((req, res, next) => {
  const time = new Date();

  console.log(`Request sent at ${time.toLocaleTimeString()}`);
  next();
});

app.use((err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res
      .status(err.status || 500)
      .json({ error: err.message || "internal server error" });
  }
});


app.get("/", (req, res) => {
  res.send("This is the home page");
});

app.use("/books", booksRouter);
app.use("/reviews", reviewsRouter);
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
