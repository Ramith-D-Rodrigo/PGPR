import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to create a new dean

const URL = SERVER_URL + SERVER_API_VERSION + "deans/";

const createDean = async (formData) => {
    return await axios.post(URL, formData);
}

export default createDean;