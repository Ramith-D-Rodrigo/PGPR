import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create vice chancellor

//url is : SERVER_URL + SERVER_API_VERSION + 'viceChancellors/'

const createViceChancellor = async (viceChancellor) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'viceChancellors/';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, viceChancellor);
}

export default createViceChancellor;
