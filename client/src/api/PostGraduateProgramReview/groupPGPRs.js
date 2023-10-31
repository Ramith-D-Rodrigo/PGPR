import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: group two pgprs

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews/{pgprId1}/group/{pgprId2}'

const groupPGPRs = async (id1, id2) => {
    const URL = SERVER_URL + SERVER_API_VERSION + `postGraduateProgramReviews/${id1}/group/${id2}`;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL);
}

export default groupPGPRs;