import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: update an evidence

//url is : SERVER_URL + SERVER_API_VERSION + 'evidences/{evidenceId}'

const updateEvidence = async (formData, evidenceId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'evidences/' + evidenceId;
    
    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.patch(URL, formData);
}

export default updateEvidence;