const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const BadRequestError = require("../Exceptions/BadRequestError");
const userModel = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  const userExists = await userModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!!");
  }

  const user = await userModel.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(500);
    throw new Error("Failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields!");
  }

  const user = await userModel.findOne({ email });

  if (user && (await user.verifyPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid username or password!!");
  }
});

// will accept the keyword as query param
const searchUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search;
  let limit = req.query.limit;
  try {
    if (keyword) {
      let user = await userModel.find(
        {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { email: { $regex: keyword, $options: "i" } },
          ],

          _id: { $ne: req.currentUser._id },
        },
        {
          name: 1,
          email: 1,
          pic: 1,
        }
      );
      if (limit) {
        limit = parseInt(limit);
        user = user.slice(0, Math.min(limit, user.length));
      }
      return res.status(200).json(user);
    } else {
      throw new Error("Missing parameters");
    }
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});

const getImage = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestError();
    }

    const image = await userModel.findById(userId, { pic: 1, _id: 0 });
    dataurl = image.pic;
    if (!dataurl) throw new Error("no pic found");
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    console.log(mime);
    let img = Buffer.from(arr[1], "base64");
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (e) {
    res.status(500);
    throw new Error(e.message);
  }
});
const userController = { registerUser, authUser, searchUser, getImage };
module.exports = userController;
