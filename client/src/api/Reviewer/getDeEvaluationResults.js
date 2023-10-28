import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get DE remarks and score of a standard of a criteria { i.e : to accept/reject assignment }

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/desk-evaluation/display-remarks'
//deskEvaluation=10&criteria=12&standard=8

const getDeEvaluationResults = async (DeskEvaluationId,criteriaId,standardId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/desk-evaluation/display-remarks?deskEvaluation='+DeskEvaluationId+'&criteria='+criteriaId+'&standard='+standardId;

    return await axios.get(URL);
}

export default getDeEvaluationResults;