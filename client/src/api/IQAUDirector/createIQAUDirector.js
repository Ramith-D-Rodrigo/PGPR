import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a new IQAU Director

//url is : SERVER_URL + SERVER_API_VERSION + 'iqauDirectors'

const URL = SERVER_URL + SERVER_API_VERSION + 'iqauDirectors/';

const createIQAUDirector = async (formData) => {
    return await axios.post(URL, formData);
}

export default createIQAUDirector;