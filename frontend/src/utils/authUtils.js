// src/utils/authUtils.js
import api from "./api";

export const register = async (username, password) => {
  try {
    const res = await api.post("register", { username, password });
    return { success: true, message: res.data.message };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Registration failed" };
  }
};

export const login = async (username, password) => {
  try {
    const res = await api.post("login", { username, password });
    localStorage.setItem("token", res.data.token);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.response?.data?.error || "Login failed" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};