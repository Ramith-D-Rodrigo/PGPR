import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the university of the faculty

//url is : SERVER_URL + SERVER_API_VERSION + 'faculty/{facultyId}/university'

const getFacultyUniversity = async (facultyId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'faculties/' + facultyId + '/university';
    return await axios.get(URL);
}

export default getFacultyUniversity;