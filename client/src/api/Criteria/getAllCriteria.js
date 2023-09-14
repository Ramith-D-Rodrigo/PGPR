import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all criteria

//url is : SERVER_URL + SERVER_API_VERSION + 'criterias/'

const getAllCriteria = async () => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'criterias/';

    return await axios.get(URL);
}

export default getAllCriteria;