import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to get the details of an academic staff

//url should be : SERVER_URL + SERVER_API_VERSION + 'academicStaffs/{academicStaffId}';

const getAcademicStaff = async (academicStaffId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'academicStaffs/' +  academicStaffId;
    return await axios.get(URL);
}

export default getAcademicStaff;

