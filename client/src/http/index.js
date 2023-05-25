import axios from "axios";
import { api_user_url } from "../config";

const userApi = axios.create({
  withCredentials: true,
  baseURL: api_user_url,
});

userApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

userApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status == 401 && err.config && !err.config._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await userApi.get(`/refresh`, {});
        localStorage.setItem("token", response.data.accessToken);
        return userApi.request(originalRequest);
      } catch (e) {
        alert("User is not logged in");
      }
    } else throw err;
  }
);

export default userApi;
