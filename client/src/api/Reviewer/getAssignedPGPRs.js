await axios.get(`${SERVER_URL}${SERVER_API_VERSION}reviewers/pgprs`);

import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get All PGPRs for a reviewer { i.e : to accept/reject assignment }

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/pgprs'

const getAssignedPGPRs = async () => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/pgprs';

    return await axios.get(URL);
}

export default getAssignedPGPRs;