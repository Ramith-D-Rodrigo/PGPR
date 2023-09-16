import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to edit a university

const editUniversity = async (universityId, universityData) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'universities/' + universityId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for patch requests

    return await axios.patch(URL, universityData);
}

export default editUniversity;

