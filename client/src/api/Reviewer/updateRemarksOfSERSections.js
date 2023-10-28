import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: to update remarks for the sections of a self evaluation report

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/pgpr/ser-remarks/update'

const updateRemarksOfSERSections = async (requestBody) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/pgpr/ser-remarks/update';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, requestBody);
}

export default updateRemarksOfSERSections;