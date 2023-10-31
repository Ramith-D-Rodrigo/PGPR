import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: Display Given DE's Scores if marked
//reviewer display the standards of a criteria with scores and comments +> URL params deskEvaluation=10&criteria=12

//url is : SERVER_URL + SERVER_API_VERSION + '/reviewer/desk-evaluation/criteria/display-remarks-scores'


const GetDeEvaluationScores = async (deId,criteriaId) => {
    
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/desk-evaluation/criteria/display-remarks-scores'+`?deskEvaluation=${deId}&criteria=${criteriaId}`;
    
    return await axios.get(URL);
}
export default GetDeEvaluationScores;