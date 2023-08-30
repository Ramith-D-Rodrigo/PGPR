import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: give approval to a pgpr application by a qac officer

//url is : SERVER_URL + SERVER_API_VERSION + 'pgprApplications/{pgprApplicationId}/qacOfficerApproval'

const approvePGPRApplicationByQAC = async (pgprApplicationId, decision) => {    //decision should be => approved or rejected
    let URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationId + '/qacOfficerApproval';
    
    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL, {status : decision});
}

export default approvePGPRApplicationByQAC;