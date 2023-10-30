import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit the decision of the dean to a review team (accept)

//url is : SERVER_URL + SERVER_API_VERSION + 'deans/acceptReviewTeam'

const acceptReviewTeam = async (formData) => {

    const URL = SERVER_URL + SERVER_API_VERSION + 'deans/acceptReviewTeam';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData);
}

export default acceptReviewTeam;