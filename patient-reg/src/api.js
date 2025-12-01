// src/api.js
import axios from "axios";

const BASE = "http://localhost:5000/api";

const api = {
  getTests: () => axios.get(`${BASE}/tests`).then((r) => r.data),

  savePatient: (payload) =>
    axios.post(`${BASE}/patients`, payload).then((r) => r.data),

  getPatients: (date) => {
    const q = date ? `?date=${encodeURIComponent(date)}` : "";
    return axios.get(`${BASE}/patients${q}`).then((r) => r.data);
  },

  getPatient: (id) =>
    axios.get(`${BASE}/patients/${id}`).then((r) => r.data),

  deletePatient: (id) => axios.delete(`${BASE}/patients/${id}`),
};

export default api;
