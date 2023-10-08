import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create and sumbit the review team

//url is : SERVER_URL + SERVER_API_VERSION + 'review-team'

const submitReviewTeam = async (formData) => {

    const URL = SERVER_URL + SERVER_API_VERSION + 'review-team';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData);
}

export default submitReviewTeam;