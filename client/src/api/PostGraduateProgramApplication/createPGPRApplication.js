import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a pgpr application

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/'

const createPGPRApplication = async (pgprApplicationData) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/';

    return await axios.post(URL, pgprApplicationData);
}

export default createPGPRApplication;