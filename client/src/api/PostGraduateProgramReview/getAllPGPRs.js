import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all pgprs

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews'

const getAllPGPRApplications = async () => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews';

    return await axios.get(URL);
}


export default getAllPGPRApplications;

