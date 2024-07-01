export const logout = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
};
