const currentUser = () => {
  return JSON.parse(localStorage.getItem("userInfo"));
};

export default currentUser;
