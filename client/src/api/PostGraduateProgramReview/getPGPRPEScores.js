import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get pe scores of a pgpr by id

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews/pe-score/{pgprId}'

const getPGPRDEScores = async (pgprId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews/de-score/' + pgprId;

    return await axios.get(URL);
}

export default getPGPRDEScores;