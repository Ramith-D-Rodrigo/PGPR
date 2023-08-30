import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a faculty

const URL = SERVER_URL + SERVER_API_VERSION + 'faculties/'; //create faculty

const createFaculty = async (facultyData) => {  //faculty data should be validated and must be a json

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL, facultyData);
}

export default createFaculty;