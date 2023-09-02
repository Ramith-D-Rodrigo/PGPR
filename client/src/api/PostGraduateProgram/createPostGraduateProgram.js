import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms'

const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/';

const createPostGraduateProgram = async (postGraduateProgramData) => {

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL, postGraduateProgramData);
}

export default createPostGraduateProgram;