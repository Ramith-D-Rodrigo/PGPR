import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a faculty

let URL = SERVER_URL + SERVER_API_VERSION + 'faculties/'; //get a faculty (faculties/{facultyId})

//possible query params:
//1 - includeUniversity (boolean -> true if you want to include the university for faculty)
//2 - includeIQAU (boolean -> true if you want to include the IQAU for faculty)
//3 - includeDean (boolean -> true if you want to include the dean for faculty)
//4 - includeAcademicStaff (boolean -> true if you want to include the academic staff of dean for faculty) (must include includeDean = true)
//5 - includeUniversitySide (boolean -> true if you want to include the university side of dean for faculty) (must include includeAcademicStaff = true)
//6 - includeUser (boolean -> true if you want to include the user of dean) (must include includeUniversitySide = true)


const getAFaculty = async (facultyId, queryParams = null) => {
    URL = URL + facultyId;

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }
    
    return await axios.get(URL);
}

export default getAFaculty; 