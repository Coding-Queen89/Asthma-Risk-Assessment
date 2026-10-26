import axios from "axios";

// SETTING UP THE BASE URL IN ONE VARIABLE FOR EASIER ACCESS AND SCALABILITY
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "https://brave-prosperity-production-9f0a.up.railway.app",
});
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
// EXPORT THE AXIOS INSTANCE
export default api;
