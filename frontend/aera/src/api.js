import axios from "axios";

// SETTING UP THE BASE URL IN ONE VARIABLE FOR EASIER ACCESS AND SCALABILITY
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});
console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);
// EXPORT THE AXIOS INSTANCE
export default api;
