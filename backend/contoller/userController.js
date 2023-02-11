const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const BadRequestError = require("../Exceptions/BadRequestError");
const InternalServerError = require("../Exceptions/InternalServerError");
const NotFoundError = require("../Exceptions/NotFoundError");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const verifyGoogleToken = require("../config/verifyGoogleToken");
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new BadRequestError("Please enter all the fields!");
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new BadRequestError("User already exists");
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
        token: generateToken(user._id),
      });
    } else {
      throw new InternalServerError("Failed to create the user");
    }
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please enter all the fields!");
    }

    const user = await userModel.findOne({ email });

    if (user && (await user.verifyPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      throw new BadRequestError("Invalid username or password!!");
    }
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const searchUser = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search;
    // limit is optional.
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    if (!keyword) {
      throw new BadRequestError("Missing parameters");
    }
    let user = await userModel
      .find(
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
        }
      )
      .limit(limit);
    return res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const getImage = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new BadRequestError("Please send user Id");
    }

    const image = await userModel.findById(userId, { pic: 1, _id: 0 });
    let dataurl = image.pic;
    if (!dataurl) throw new NotFoundError("No Image Found");
    let arr = dataurl.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    console.log(mime);
    let img = Buffer.from(arr[1], "base64");
    res.writeHead(200, {
      "Content-Type": mime,
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});
const googleSignIn = asyncHandler(async (req, res) => {
  try {
    const { googleToken } = req.body;

    //verify the integrity of the token
    const { name, email, picture, email_verified } = await verifyGoogleToken(
      googleToken
    );

    if (!name || !email) {
      res.status(400);
      throw new BadRequestError("Please enter all the fields!");
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      let returnedB64 = "";
      if (picture) {
        let image = await axios.get(picture, {
          responseType: "arraybuffer",
        });
        returnedB64 = `data:${
          image.headers["content-type"]
        };base64,${Buffer.from(image.data).toString("base64")}`;
      }

      user = await userModel.create({
        name,
        email,
        verified: email_verified,
        pic: returnedB64,
        password: (Math.random() + 1).toString(36),
      });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      throw new InternalServerError("Failed to create the user");
    }
  } catch (error) {
    res.status(error.statusCode || 500);
    throw error;
  }
});

const userController = {
  registerUser,
  authUser,
  searchUser,
  getImage,
  googleSignIn,
};
module.exports = userController;
