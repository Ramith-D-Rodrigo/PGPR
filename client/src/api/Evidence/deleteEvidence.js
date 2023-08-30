import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: delete an evidence

//url is : SERVER_URL + SERVER_API_VERSION + 'evidences'
let URL = SERVER_URL + SERVER_API_VERSION + 'evidences/'; // endpoint should be -> evidences/{evidenceId}

const deleteEvidence = async (evidenceId) => {
    URL = URL + evidenceId;

    axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for delete requests
    return await axios.delete(URL);
}

export default deleteEvidence;