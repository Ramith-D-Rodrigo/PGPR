import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: remove the dean role from a user

//url is : SERVER_URL + SERVER_API_VERSION + 'deans/{deanId}/removeRole'

const removeDeanRole = async (deanId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'deans/' + deanId + '/removeRole';

    axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for delete requests
    return await axios.delete(URL);
}

export default removeDeanRole;

