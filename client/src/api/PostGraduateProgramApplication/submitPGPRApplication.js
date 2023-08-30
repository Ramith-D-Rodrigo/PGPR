import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit a pgpr application 

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}/submit'

const submitPGPRApplication = async (pgprApplicationId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId + '/submit';

    return await axios.post(URL);
}

export default submitPGPRApplication;