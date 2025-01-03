import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: edit a pgpr application

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}'

const editPGPRApplication = async (pgprApplicationId, pgprApplicationData) => {
    pgprApplicationData.append('_method', 'patch'); //for laravel to know that this is a patch request

    const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    //pgprApplicationData have the atrribute -> _method: 'patch' (so that laravel knows that this is a patch request)
    return await axios.post(URL, pgprApplicationData);
}

export default editPGPRApplication;