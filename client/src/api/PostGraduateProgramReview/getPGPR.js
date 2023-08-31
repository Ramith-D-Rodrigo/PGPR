import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a pgpr by id

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews/{pgprId}'

const getPGPR = async (pgprId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews/' + pgprId;

    return await axios.get(URL);
}

export default getPGPR;