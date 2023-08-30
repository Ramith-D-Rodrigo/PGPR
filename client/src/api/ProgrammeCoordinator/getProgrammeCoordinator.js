import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get a programme coordinator by id

//url is : SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/{programmeCoordinatorId}'

//possible query params:
//1 - includeAcademicStaff (boolean -> true if you want to include the academic staff of the programme coordinator)
//2 - includeUniversitySide (boolean -> true if you want to include the programme coordinator) (must require includeAcademicStaff to be true)
//3 - includeUser (boolean -> true if you want to include the user of the programme coordinator) (must require includeUniversitySide to be true)

const getProgrammeCoordinator = async (programmeCoordinatorId, queryParams = null) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/' + programmeCoordinatorId;

    if(queryParams != null) {
        return await axios.get(URL, {params : queryParams});
    }

    return await axios.get(URL);
}

export default getProgrammeCoordinator;