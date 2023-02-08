const mongoose = require("mongoose");
const validator = require("validator");
const encrypt = require("../config/encrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: [3, "name must have atleast 3 characters"],
      maxLength: [100, "name can have max 100 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid Email",
      },
    },
    password: {
      type: String,
      validate: {
        validator: function () {
          if (this.verified) return true;
          if (!this.password) return false;
        },
        message: "Password is required",
      },
    },
    pic: {
      type: String,
      default: "",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.verifyPassword = async function (pswdStr) {
  return await encrypt.verifyPasswords(pswdStr, this.password);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  this.password = await encrypt.hashPassword(this.password);
});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
