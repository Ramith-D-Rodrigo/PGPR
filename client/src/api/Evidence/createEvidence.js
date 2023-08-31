import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a new evidence

//url is : SERVER_URL + SERVER_API_VERSION + 'evidences'
const URL = SERVER_URL + SERVER_API_VERSION + 'evidences/';

const createEvidence = async (formData) => {

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL, formData);
}

export default createEvidence;