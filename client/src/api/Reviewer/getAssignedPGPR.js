import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get All PGPRs for a reviewer { i.e : to accept/reject assignment }

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/pgprs'

const getAssignedPGPRs = async (pgprID) => {
    const URL = SERVER_URL + SERVER_API_VERSION + `reviewers/pgprs/${pgprID}`;

    return await axios.get(URL);
}

export default getAssignedPGPRs;