const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encPassword = await bcrypt.hash(password, salt);
  return encPassword;
};

const verifyPasswords = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

const encrypt = { hashPassword, verifyPasswords };
module.exports = encrypt;
