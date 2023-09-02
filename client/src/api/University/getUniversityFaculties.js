import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all faculties of a university

//get all faculties of a university (universities/{universityId}/faculties)

const getUniversityFaculties = async (universityId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'universities/' + universityId + '/faculties';
    return await axios.get(URL);
}

export default getUniversityFaculties;
