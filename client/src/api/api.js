import axios from "axios";

// base url configuration
export default axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
