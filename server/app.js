const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const methodOverride = require("method-override");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(morgan("dev"));

//Connection to MongoDB
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database connected Successfully 👍");
  }
);

const conn = mongoose.connection;
module.exports = conn;

//Base Routes
app.get("/", async (req, res, next) => {
  res.send({ message: "Awesome it works 🐻" });
});


//Working Routes
const userRoutes = require("./routes/user");
const imageRouter=require("./routes/images");
const warehouseRoutes = require("./routes/warehouse");
const mapRoutes=require("./routes/map");
app.use("/api/map",mapRoutes);
app.use("/api/users", userRoutes);
app.use("/api/images", imageRouter);
app.use("/api/warehouse", warehouseRoutes);

//Not Found & Error Routes
app.use((req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

//Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));