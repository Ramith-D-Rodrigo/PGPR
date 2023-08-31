import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get pgprs of a post graduate program

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/{postGraduateProgramId}/reviews'

//possible query params:
//1 - includeFaculty (boolean -> true if you want to include the faculty of the pgpr)
//2 - includeUniversity (boolean -> true if you want to include the university of the pgpr) (must request includeFaculty)

const getPostGraduateProgramPGPRs = async (postGraduateProgramId, queryParams = null) => {  //queryParams should be an object
    const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms/' + postGraduateProgramId + '/reviews';
    if(queryParams != null){
        return await axios.get(URL, {params: queryParams});
    }

    return await axios.get(URL);
}

export default getPostGraduateProgramPGPRs;