import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to get the faculty of a iqau director

//url should be : SERVER_URL + SERVER_API_VERSION + 'iqauDirectors/{iqauDirectorId}/faculty';

const getIQAUDirectorFaculty = async (iqauDirectorId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'iqauDirectors/' +  iqauDirectorId + '/faculty';
    return await axios.get(URL);
}

export default getIQAUDirectorFaculty;

