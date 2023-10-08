import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: delete a pending review team

//url is : SERVER_URL + SERVER_API_VERSION + 'review-team/{reviewTeamId}'

const removePendingReviewTeam = async (reviewTeamId) => {

    const URL = SERVER_URL + SERVER_API_VERSION + 'review-team/' + reviewTeamId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.delete(URL);
}

export default removePendingReviewTeam;