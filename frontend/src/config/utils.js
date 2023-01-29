const timeout = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const sender = (currentUser, allUsers) => {
  return allUsers[0]._id === currentUser._id ? allUsers[1] : allUsers[0];
};
const utils = { timeout, sender };
export default utils;
