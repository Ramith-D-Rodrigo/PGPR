import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: delete a pgpr application

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}'

const deletePGPRApplication = async (pgprApplicationId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId;

    return await axios.delete(URL);
}

export default deletePGPRApplication;