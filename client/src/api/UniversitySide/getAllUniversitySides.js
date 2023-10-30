import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all university sies

const URL = SERVER_URL + SERVER_API_VERSION + 'universitySides/'; //get all universities


const getAllUniversitySides = async () => {
    return await axios.get(URL);
}

export default getAllUniversitySides;