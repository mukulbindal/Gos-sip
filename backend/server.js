const express = require("express");
require("dotenv").config();
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const userRouter = require("./routes/userRoutes");
const errorHandlers = require("./middleware/errorHandlers");
const chatRoutes = require("./routes/chatRoutes");

connectDB();
const app = express();
app.use(express.json()); // to accept json data

// empty route to ensure app is working
app.get("/", (req, res) => {
  res.send("Page is working");
});

// If route matches api/user, use user Router
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoutes);
// If no match found, use notFound handler to handle error
app.use(errorHandlers.notFound);

// At last if any error, (err param in next function), use below handler
// But we are not using next(err) anywhere.
// This works because we are using the express-async-handler
// which will automatically use next(err) for us.
app.use(errorHandlers.errorHandler);

// Choose port, default is 8080
const PORT = process.env.PORT || 8080;

// Start the express App
app.listen(
  PORT,
  console.log(`Server started on PORT ${PORT}`.yellow.underline.bold)
);
