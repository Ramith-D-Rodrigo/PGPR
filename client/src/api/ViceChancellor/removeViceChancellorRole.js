import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: remove vice chancellor role from a user

//url is : SERVER_URL + SERVER_API_VERSION + 'viceChancellors/{vcId}/removeRole'

const removeViceChancellorRole = async (vcId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'viceChancellors/' + vcId + '/removeRole';

    return await axios.delete(URL);
}

export default removeViceChancellorRole;