import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to get university of a vice chancellor

//url should be : SERVER_URL + SERVER_API_VERSION + 'viceChancellors/{viceChancellorId}/university';

const getViceChancellorUniversity = async (viceChancellorId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'viceChancellors/' +  viceChancellorId + '/university';
    return await axios.get(URL);
}

export default getViceChancellorUniversity;

