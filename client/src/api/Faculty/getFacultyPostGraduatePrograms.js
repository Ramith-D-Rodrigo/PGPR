import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all post graduate programs of a faculty

//url is : SERVER_URL + SERVER_API_VERSION + 'faculties/{facultyId}/postGraduatePrograms'

const getFacultyPostGraduatePrograms = async (facultyId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'faculties/' + facultyId + '/postGraduatePrograms';
    return await axios.get(URL);
}

export default getFacultyPostGraduatePrograms;