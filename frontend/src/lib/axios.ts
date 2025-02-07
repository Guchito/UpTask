import axios from "axios";
import { env } from "process";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export default api