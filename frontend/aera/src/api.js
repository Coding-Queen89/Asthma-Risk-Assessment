import axios from "axios";

// SETTING UP THE BASE URL IN ONE VARIABLE FOR EASIER ACCESS AND SCALABILITY
const api = axios.create({
    baseURL: "http://192.168.1.107:9000",
});

// EXPORT THE AXIOS INSTANCE
export default api;
