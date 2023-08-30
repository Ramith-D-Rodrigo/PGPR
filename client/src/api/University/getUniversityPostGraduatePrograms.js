import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all post graduate programs of a university

//url is : SERVER_URL + SERVER_API_VERSION + 'universities/{universityId}/postGraduatePrograms'
const getUniversityPostGraduatePrograms = async (universityId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'universities/' + universityId + '/postGraduatePrograms';
    return await axios.get(URL);
}

export default getUniversityPostGraduatePrograms;