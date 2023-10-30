import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit the decision of the dean to a review team (reject)

//url is : SERVER_URL + SERVER_API_VERSION + 'deans/rejectReviewTeam'

const rejectReviewTeam = async (formData) => {

    const URL = SERVER_URL + SERVER_API_VERSION + 'deans/rejectReviewTeam';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData);
}

export default rejectReviewTeam;