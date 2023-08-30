import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the faculty of the dean

//url is : SERVER_URL + SERVER_API_VERSION + 'deans/{deanId}/faculty'
let URL = SERVER_URL + SERVER_API_VERSION + 'deans/';

const getDeanFaculty = async (deanId) => {  //logged in dean -> get the id from auth (auth.id)
    URL = URL + deanId + '/faculty';
    return await axios.get(URL);
}

export default getDeanFaculty;