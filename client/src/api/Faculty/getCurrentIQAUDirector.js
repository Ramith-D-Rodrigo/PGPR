import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get current iqau director of a faculty

//to get current iqau director, => faculties/{facultyId}/currentIQAUDirector

//possible query params:
//1 - includeQualityAssuranceStaff (boolean -> true if you want to include the quality assurance staff of iqau director for faculty)
//2 - includeUniversitySide (boolean -> true if you want to include the university side of iqau director for faculty) (must include includeQualityAssuranceStaff = true)
//3 - includeUser (boolean -> true if you want to include the user of iqau director) (must include includeUniversitySide = true)


const getCurrentIQAUDirector = async (facultyId, queryParams = null) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'faculties/' + facultyId + '/currentIQAUDirector';

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }

    return await axios.get(URL);
}

export default getCurrentIQAUDirector;
