import axios from "axios";

// base url configuration
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios.create({
  // baseURL: "http://localhost:8000",
  baseURL: "http://13.232.29.5:8000",
  withCredentials: true,
});
