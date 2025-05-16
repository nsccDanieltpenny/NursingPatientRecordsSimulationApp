import axios from "axios";

const API_HOST = import.meta.env.VITE_API_URL;

// when you import this file instead of axios, it allows you to just add the relative path 
// ex: axios.post(`/api/Auth/register`, formattedData);
export default axios.create({
  baseURL: API_HOST
});