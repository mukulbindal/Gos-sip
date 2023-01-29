const setCurrentUser = (userInfo) => {
  const user = JSON.stringify(userInfo);
  localStorage.setItem("userInfo", user);
  return userInfo;
};

export default setCurrentUser;
