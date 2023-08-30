import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a university

const URL = SERVER_URL + SERVER_API_VERSION + 'universities/'; //create a university

const createUniversity = async (universityData) => {    //make sure to validate the data before sending it (must be json)
    return await axios.post(URL, universityData);
}

export default createUniversity;