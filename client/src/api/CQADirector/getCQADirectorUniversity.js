import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to get the university of a CQADirector

//url should be : SERVER_URL + SERVER_API_VERSION + 'cqaDirectors/{cqaDirectorId}/university';

const getCQADirectorUniversity = async (cqaDirectorId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'cqaDirectors/' +  cqaDirectorId + '/university';
    return await axios.get(URL);
}

export default getCQADirectorUniversity;

