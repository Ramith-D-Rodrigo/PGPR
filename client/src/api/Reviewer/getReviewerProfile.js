import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the reviewer profile of a reviewer

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/{reviewerId}'

const getReviewerProfile = async (reviewerId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + `reviewers/${reviewerId}`;

    return await axios.get(URL);
}

export default getReviewerProfile;