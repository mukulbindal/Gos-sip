const express = require("express");
require("dotenv").config();
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRouter = require("./routes/userRoutes");

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("Page is working");
});

app.use("/api/user", userRouter);
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server started on PORT ${PORT}`.yellow.underline.bold)
);
