import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: remove the role of IQAU Director from a user

//url is : SERVER_URL + SERVER_API_VERSION + 'iqauDirectors'
let URL = SERVER_URL + SERVER_API_VERSION + 'iqauDirectors/'; // endpoint should be -> iqauDirectors/{iqauDirectorId}/removeRole

const removeIQAUDirectorRole = async (iqauDirectorId) => {
    URL = URL + iqauDirectorId + "/removeRole";
    return await axios.delete(URL);
}

export default removeIQAUDirectorRole;