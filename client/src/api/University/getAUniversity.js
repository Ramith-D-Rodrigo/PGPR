import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a university


//possible query params:
//1 - includeCQA (boolean -> true if you want to include the CQA for each university)
//2 - includeViceChancellor (boolean -> true if you want to include the vice chancellor for each university)
//3 - includeUniversitySide (boolean -> true if you want to include the university side of vice chancellor for each university) (must include includeViceChancellor = true)
//4 - includeUser (boolean -> true if you want to include the user of vice chancellor for each university) (must include includeUniversitySide = true)

const getAUniversity = async (universityId, queryParams = null) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'universities/'; //get a university (universities/{universityId})
    URL = URL + universityId;

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }

    return await axios.get(URL);
}

export default getAUniversity;