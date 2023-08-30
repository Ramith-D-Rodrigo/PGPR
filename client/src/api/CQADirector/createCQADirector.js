import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to create a new CQADirector

const URL = SERVER_URL + SERVER_API_VERSION + 'cqaDirectors/';

const createCQADirector = async (cqaDirectorData) => {
    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL, cqaDirectorData);
}

export default createCQADirector;

