import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get desk evaluation progress of a criteria of a pgpr
// +> URL params deskEvaluation=10&criteria=12

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/desk-evaluation/view-progress'


const GetDeskEvaluationProgress = async (deskEvaluationId,criteriaId=null) => {
    
    const URL = SERVER_URL + SERVER_API_VERSION + `reviewer/desk-evaluation/view-progress?deskEvaluation=${deskEvaluationId}${criteriaId==null? '' : `&criteria=${criteriaId}`}`;

    return await axios.get(URL);
}
export default GetDeskEvaluationProgress;