import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a specific PGPR for a reviewer { i.e : to accept/reject assignment }

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/pgprs'

const getSpecificPGPR = async (pgprId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + `reviewers/pgprs/${pgprId}`;
    // console.log(URL);

    return await axios.get(URL);
}

export default getSpecificPGPR;