import axios from "axios";
import jwt from "jwt-decode";
import URL from "./config";
import { toast } from "react-toastify";

const uninterceptedAxiosInstance = axios.create();

axios.interceptors.request.use((req) => {
  getCurrentUser();
  return req;
});

const checkLoggedIn = async () => {
  if (await localStorage.getItem("accessToken")) {
    return true;
  } else {
    return false;
  }
};

const getUserType = async () => {
  const userToken = localStorage.getItem("accessToken");
  if (userToken) {
    return jwt(userToken).RoleName;
  } else throw new Error("Error getting user type");
};

const login = async ({ username, password }) => {
  try {
    const response = await axios.post(
      `${URL.BASE_URL}/api/auth/authenticate`,
      {
        username: username,
        password: password,
      },
      {}
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

const getCurrentUser = () => {
  try {
    const userToken = localStorage.getItem("accessToken");
    const decodedToken = jwt(userToken);
    if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
      return TokenExpired();
    }
    return decodedToken;
  } catch (ex) {
    return null;
  }
};

const getToken = () => {
  return localStorage.getItem("accessToken");
};

const saveTokenToLocalStorage = (token) => {
  localStorage.setItem("accessToken", token);
};

const deleteTokenFromLocalStorage = () => {
  localStorage.removeItem("accessToken");
  // alert("Signed Out Successfully");
};

const TokenExpired = () => {
  localStorage.removeItem("accessToken");
  // alert("Your Session Expired, Please Login Again");
  toast.error("Error while updating user details, please try again", {
    position: "top-center",
  });
  window.location.replace("UniTrav/#/login");
};

export {
  login,
  saveTokenToLocalStorage,
  deleteTokenFromLocalStorage,
  getToken,
  getCurrentUser,
  checkLoggedIn,
  getUserType,
};
