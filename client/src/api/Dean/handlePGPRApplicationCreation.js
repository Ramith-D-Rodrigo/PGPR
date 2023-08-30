import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants.js";
import axios from "../api.js";

//DEPRECATED FUNCTION

const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/';

const handlePGPRApplicationCreation = (formData) => {

    return axios.post(URL, JSON.stringify(formData), {
        headers: 'application/json'
    })

}

export default handlePGPRApplicationCreation;