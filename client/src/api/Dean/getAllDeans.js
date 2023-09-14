import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all deans

//url is : SERVER_URL + SERVER_API_VERSION + 'deans'
const URL = SERVER_URL + SERVER_API_VERSION + 'deans';

//possible query params:
//1 - includeAcademicStaff (boolean -> true if you want to include the academic staff for each dean)
//2 - includeUniversitySide (boolean -> true if you want to include the university side of each dean) (must include includeAcademicStaff = true)
//3 - includeUser (boolean -> true if you want to include the user of dean) (must include includeUniversitySide = true)

const getAllDeans = async (queryParams = null) => {

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }
    
    return await axios.get(URL);
}

export default getAllDeans;