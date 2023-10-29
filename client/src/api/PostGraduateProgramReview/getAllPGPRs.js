import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all pgprs

//url is : SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews'

//possible query params:
// 1 - includeDE (boolean -> true if you want to include the DE)
// 2 - includePE (boolean -> true if you want to include the PE)

const getAllPGPRs = async (queryParams = null) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduateProgramReviews';

    if(queryParams !== null){
        return await axios.get(URL, {params: queryParams});
    }
    return await axios.get(URL);
}


export default getAllPGPRs;

