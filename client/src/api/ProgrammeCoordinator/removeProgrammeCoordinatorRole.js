import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: remove the programme coordinator role of a user

//url is : SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/{programmeCoordinatorId}/removeRole'

const removeProgrammeCoordinatorRole = async (programmeCoordinatorId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/' + programmeCoordinatorId + '/removeRole';

    return await axios.delete(URL);
}

export default removeProgrammeCoordinatorRole;