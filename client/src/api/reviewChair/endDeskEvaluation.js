import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: end desk evaluation after all reviewers evaluated criteria 7
//params: none

//url is : SERVER_URL + SERVER_API_VERSION + 'review-team-chair/desk-evaluation/submit'


const EndDeskEvaluation = async (pgprId) => {
    
    const URL = SERVER_URL + SERVER_API_VERSION + 'review-team-chair/desk-evaluation/submit';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL,{
        pgpr : pgprId
    });
}

export default EndDeskEvaluation;