import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function is to update the details of an academic staff profile

//url should be : SERVER_URL + SERVER_API_VERSION + 'academicStaffs/{academicStaffId}';

const updateAcademicStaffProfile = async (academicStaffId, profileData) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'academicStaffs/' +  academicStaffId;
    
    //add _method PATCH to formData
    profileData.append('_method', 'PATCH');

    //do the post request
    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, profileData);
}

export default updateAcademicStaffProfile;

