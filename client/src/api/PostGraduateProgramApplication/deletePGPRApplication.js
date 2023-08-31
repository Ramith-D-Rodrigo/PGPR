import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: delete a pgpr application

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}'

const deletePGPRApplication = async (pgprApplicationId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for delete requests
    return await axios.delete(URL);
}

export default deletePGPRApplication;