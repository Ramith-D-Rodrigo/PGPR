import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to remove the role of CQADirector from a user

let URL = SERVER_URL + SERVER_API_VERSION + 'cqaDirectors/';

const removeCQADirectorRole = async (cqaDirectorId) => {
    URL = URL + cqaDirectorId + '/removeRole';
    return await axios.delete(URL);
}

export default removeCQADirectorRole;
