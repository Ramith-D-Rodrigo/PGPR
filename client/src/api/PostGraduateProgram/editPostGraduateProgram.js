import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: edit a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}'

let URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/';

const editPostGraduateProgram = async (postGraduateProgramId, postGraduateProgramData) => {
    URL = URL + postGraduateProgramId;
    return await axios.patch(URL, postGraduateProgramData);
}

export default editPostGraduateProgram;