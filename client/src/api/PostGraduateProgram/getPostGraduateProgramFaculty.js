import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the faculty of a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}/faculty'

const getPostGraduateProgramFaculty = async (postGraduateProgramId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/' + postGraduateProgramId + '/faculty';
    return await axios.get(URL);
}

export default getPostGraduateProgramFaculty;
