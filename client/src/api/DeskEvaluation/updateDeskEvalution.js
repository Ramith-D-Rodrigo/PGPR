import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: update the desk evaluation (start date, end date, status, etc.)

//url is : SERVER_URL + SERVER_API_VERSION + 'desk-evaluation/{deskEvaluationId}

//a patch request is sent to the server with the updated data


const updateDeskEvaluation = async (deId, requestBody) => {
    const URL = SERVER_URL + SERVER_API_VERSION + "desk-evaluation/" + deId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.patch(URL, requestBody);
}

export default updateDeskEvaluation;