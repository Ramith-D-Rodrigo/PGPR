import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get current dean of a faculty

let URL = SERVER_URL + SERVER_API_VERSION + 'faculties/'; //to get current dean, => faculties/{facultyId}/currentDean

//possible query params:
//1 - includeAcademicStaff (boolean -> true if you want to include the academic staff of dean for faculty) (must include includeDean = true)
//2 - includeUniversitySide (boolean -> true if you want to include the university side of dean for faculty) (must include includeAcademicStaff = true)
//3 - includeUser (boolean -> true if you want to include the user of dean) (must include includeUniversitySide = true)


const getCurrentDean = async (facultyId, queryParams = null) => {
    URL = URL + facultyId + '/currentDean';

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }

    return await axios.get(URL);
}

export default getCurrentDean;
