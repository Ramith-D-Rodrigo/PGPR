import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get current vice chancellor of the university

//get current vice chancellor of the university (universities/{universityId}/currentViceChancellor)

//possible query params
//1 - includeUniversitySide (boolean -> true if you want to include the university side of vice chancellor for each university) (must include includeViceChancellor = true)
//2 - includeUser (boolean -> true if you want to include the user of vice chancellor for each university) (must include includeUniversitySide = true)

const getCurrentViceChancellor = async (universityId, queryParams = null) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'universities/' + universityId + '/currentViceChancellor';

    if(queryParams) {
        return await axios.get(URL, { params: queryParams });
    }

    return await axios.get(URL);
}

export default getCurrentViceChancellor;