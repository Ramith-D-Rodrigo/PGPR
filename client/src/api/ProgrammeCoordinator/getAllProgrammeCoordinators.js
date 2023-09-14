import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get all programme coordinators

//url is : SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators'

//possible query params:
//1 - includePostGraduateProgramme (boolean -> true if you want to include the post graduate programme)
//2 - includeAcademicStaff (boolean -> true if you want to include the academic staff of the programme coordinator)
//3 - includeUniversitySide (boolean -> true if you want to include the programme coordinator) (must require includeAcademicStaff to be true)
//4 - includeUser (boolean -> true if you want to include the user of the programme coordinator) (must require includeUniversitySide to be true)

const getAllProgrammeCoordinators = async (queryParams = null) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators';

    if (queryParams != null) {
        return await axios.get(URL, {params : queryParams});
    }

    return await axios.get(URL);
}

export default getAllProgrammeCoordinators;