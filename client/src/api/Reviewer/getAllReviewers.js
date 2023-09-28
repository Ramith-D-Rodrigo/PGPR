import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get All reviewers in the system

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/'

const getAllReviewers = async () => {
    const URL = SERVER_URL + SERVER_API_VERSION + `reviewers/`;

    return await axios.get(URL);
}

export default getAllReviewers;