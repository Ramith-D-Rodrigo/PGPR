import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all universities

const URL = SERVER_URL + SERVER_API_VERSION + 'universities/'; //get all universities

//possible query params:
//1 - includeCQA (boolean -> true if you want to include the CQA for each university)
//2 - includeViceChancellor (boolean -> true if you want to include the vice chancellor for each university)
//3 - includeUniversitySide (boolean -> true if you want to include the university side of vice chancellor for each university) (must include includeViceChancellor = true)
//4 - includeUser (boolean -> true if you want to include the user of vice chancellor for each university) (must include includeUniversitySide = true)


const getAllUniversities = async (queryParams = null) => {
    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }

    return await axios.get(URL);
}

export default getAllUniversities;