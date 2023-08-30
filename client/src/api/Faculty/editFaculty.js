import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: edit details of a faculty

let URL = SERVER_URL + SERVER_API_VERSION + 'faculties/'; //edit a faculty (faculties/{facultyId})

const editFaculty = async (facultyId, facultyData) => {
    URL = URL + facultyId;
    return await axios.patch(URL, facultyData);
}

export default editFaculty;