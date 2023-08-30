import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the faculty of a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}/faculty'

let URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/';


const getPostGraduateProgramFaculty = async (postGraduateProgramId) => {
    URL = URL + postGraduateProgramId + '/faculty';
    return await axios.get(URL);
}

export default getPostGraduateProgramFaculty;
