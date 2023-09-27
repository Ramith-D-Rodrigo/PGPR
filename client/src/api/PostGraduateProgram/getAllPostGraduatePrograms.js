import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all post graduate programs

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms'

const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/';

//possible query params:
// 1 - includeFaculty (boolean -> true if you want to include the faculty of the post graduate program)
// 2 - includeCurrentCoordinator (boolean -> true if you want to include the current coordinator id of the post graduate program)
// 3 - includeAcademicStaff (boolean -> true if you want to include academic staff id of the current coordinator of the post graduate program) (must request includeCurrentCoordinator)
// 4 - includeUniversitySide (boolean -> true if you want to include the university side of the current coordinator of the post graduate program) (must request includeAcademicStaff)
// 5 - includeUser (boolean -> true if you want to include the user details of the current coordinator of the post graduate program) (must request includeUniversitySide)
    //(this will include the user initials, surname, id)
// 6 - includeUniversity (boolean -> true if you want to include the university of the post graduate program, must request includeFaculty)

const getAllPostGraduatePrograms = async (queryParams = null) => { //queryParams should be an object
    if (queryParams.length !== null) {
        return await axios.get(URL, { params: queryParams });
    }
    return await axios.get(URL);
}

export default getAllPostGraduatePrograms;