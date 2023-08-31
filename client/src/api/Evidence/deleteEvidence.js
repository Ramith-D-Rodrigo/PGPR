import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: delete an evidence

//url is : SERVER_URL + SERVER_API_VERSION + 'evidences'

const deleteEvidence = async (evidenceId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'evidences/'+ evidenceId; // endpoint should be -> evidences/{evidenceId} 

    axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for delete requests
    return await axios.delete(URL);
}

export default deleteEvidence;