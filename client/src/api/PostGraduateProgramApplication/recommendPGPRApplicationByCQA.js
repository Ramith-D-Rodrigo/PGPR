import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: recommend a pgpr application by a cqa director

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}/cqaDirectorApprove'

const recommendPGPRApplicationByCQADirector = async (pgprApplicationId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId + '/cqaDirectorApprove';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL);
}

export default recommendPGPRApplicationByCQADirector;



