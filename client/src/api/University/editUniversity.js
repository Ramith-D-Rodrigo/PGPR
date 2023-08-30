import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to edit a university

let URL = SERVER_URL + SERVER_API_VERSION + 'universities/';

const editUniversity = async (universityId, universityData) => {
    URL = URL + universityId;
    return await axios.put(URL, universityData);
}

export default editUniversity;

