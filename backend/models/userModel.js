const mongoose = require("mongoose");
const encrypt = require("../config/encrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      required: false,
      default: "",
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
