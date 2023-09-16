import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: edit details of a faculty

 //edit a faculty (faculties/{facultyId})

const editFaculty = async (facultyId, facultyData) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'faculties/' + facultyId;

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for patch requests
    return await axios.patch(URL, facultyData);
}

export default editFaculty;