import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all faculties of a university

let URL = SERVER_URL + SERVER_API_VERSION + 'universities/'; //get all faculties of a university (universities/{universityId}/faculties)

const getUniversityFaculties = async (universityId) => {
    URL = URL + universityId + '/faculties';
    return await axios.get(URL);
}

export default getUniversityFaculties;
