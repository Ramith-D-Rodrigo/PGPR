import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the post graduate programme of a programme coordinator

//url is : SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/{programmeCoordinatorId}/postGraduateProgram'
const getCoordinatorPGP = async (programmeCoordinatorId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'programmeCoordinators/' + programmeCoordinatorId + '/postGraduateProgram';

    return await axios.get(URL);
}

export default getCoordinatorPGP;