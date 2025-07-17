import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:8000/api",
  withCredentials: true,
});
