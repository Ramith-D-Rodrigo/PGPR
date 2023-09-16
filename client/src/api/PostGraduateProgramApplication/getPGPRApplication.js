import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a pgpr application by id

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}'

//possible query params:
//1 - includePostGraduateProgram (boolean -> true if you want to include the post graduate program of the pgpr application)
//2 - includeFaculty (boolean -> true if you want to include the faculty of the pgpr application) (must request includePostGraduateProgram)
//3 - includeUniversity (boolean -> true if you want to include the university of the pgpr application) (must request includeFaculty)

const getPGPRApplication = async (pgprApplicationId, queryParams = null) => {   //queryParams should be an object
    const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId;

    if(queryParams != null){
        return await axios.get(URL, {params: queryParams});
    }

    return await axios.get(URL);
}

export default getPGPRApplication;