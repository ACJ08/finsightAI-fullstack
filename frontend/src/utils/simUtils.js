// src/utils/simUtils.js
import api from "./api";

export const createSim = async (simData) => {
  try {
    const res = await api.post("/new-sim", simData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Failed to create simulation";
  }
};

export const getAllSims = async () => {
  try {
    const res = await api.get("/get-all-sims");
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Failed to fetch simulations";
  }
};

// NEW: Added the deleteSim command to our frontend toolbox
export const deleteSim = async (simId) => {
  try {
    // We use api.delete to hit the app.delete route on our backend
    const res = await api.delete(`/delete-sim/${simId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Failed to delete simulation";
  }
};


export const rerunSim = async (simId, updatedData) => {
  try {
    // Grab the token from local storage
    const token = localStorage.getItem("token");
    
    // Explicitly attach it to the headers so the backend knows you are logged in
    const res = await api.put(`/rerun-sim/${simId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    // This logs the REAL error to your browser console so you can see it!
    console.error("Rerun API Error:", err.response?.data || err);
    throw err.response?.data?.error || "Failed to re-run simulation";
  }
};