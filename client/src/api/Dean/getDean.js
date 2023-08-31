import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a dean by id

//url is : SERVER_URL + SERVER_API_VERSION + 'deans/{deanId}'

//possible query params:
//1 - includeAcademicStaff (boolean -> true if you want to include the academic staff for each dean)
//2 - includeUniversitySide (boolean -> true if you want to include the university side of each dean) (must include includeAcademicStaff = true)
//3 - includeUser (boolean -> true if you want to include the user of dean) (must include includeUniversitySide = true)

const getDean = async (deanId, queryParams = null) => {  //if logged in dean -> get the id from auth (auth.id)
    const URL = SERVER_URL + SERVER_API_VERSION + 'deans/' + deanId;

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }
    
    return await axios.get(URL);
}

export default getDean;