import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit desk evaluation
//params: none

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/submit-desk-evaluation'

const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/submit-desk-evaluation';

const SubmitDeskEvaluation = async (DEid) => {

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL,{
        deskEvaluation : DEid
    });
}

export default SubmitDeskEvaluation;