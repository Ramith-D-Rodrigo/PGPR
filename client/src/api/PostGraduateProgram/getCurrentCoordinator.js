import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the current coordinator of a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}/currentCoordinator'

//possible query params:
// 1 - includeAcademicStaff (boolean -> true if you want to include academic staff id of the current coordinator of the post graduate program)
// 2 - includeUniversitySide (boolean -> true if you want to include the university side of the current coordinator of the post graduate program) (must request includeAcademicStaff)
// 3 - includeUser (boolean -> true if you want to include the user details of the current coordinator of the post graduate program) (must request includeUniversitySide)
    //(this will include the user initials, surname, id)

const getCurrentCoordinator = async (postGraduateProgramId, queryParams = null) => {    //queryParams should be an object
    let URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/' + postGraduateProgramId + '/currentCoordinator';

    if (queryParams !== null) {
        return await axios.get(URL, { params: queryParams });
    }
    return await axios.get(URL);
}

export default getCurrentCoordinator;