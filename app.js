const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");

const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

const Main = require("./config/main");
new Main(db.cosmosClient, db.databaseId);

app.use('/api/users', require('./routes/user'));
app.use('/api/maps', require('./routes/map'));
app.use('/api/sensors', require('./routes/data'));

app.use((next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
