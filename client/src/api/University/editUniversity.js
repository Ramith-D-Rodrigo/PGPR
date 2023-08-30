import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to edit a university

let URL = SERVER_URL + SERVER_API_VERSION + 'universities/';

const editUniversity = async (universityId, universityData) => {
    URL = URL + universityId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for patch requests

    return await axios.patch(URL, universityData);
}

export default editUniversity;

