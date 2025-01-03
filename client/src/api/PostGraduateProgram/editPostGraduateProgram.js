import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: edit a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}'

const editPostGraduateProgram = async (postGraduateProgramId, postGraduateProgramData) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/' + postGraduateProgramId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for patch requests
    return await axios.patch(URL, postGraduateProgramData);
}

export default editPostGraduateProgram;