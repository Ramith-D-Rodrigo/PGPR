import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: create a new programme coordinator

//url is : SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators'

const createProgrammeCoordinator = async (programmeCoordinatorData) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators';

    return await axios.post(URL, programmeCoordinatorData);
}

export default createProgrammeCoordinator;