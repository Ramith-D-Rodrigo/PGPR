import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get desk evaluation progress of a DE of a review Team

//url is : SERVER_URL + SERVER_API_VERSION + 'review-team-chair/desk-evaluation/view-progress/{reviewTeam}/{deskEvaluation}


const GetDEprogress = async (reviewTeamId,deskEvaluationId) => {
    
    const URL = SERVER_URL + SERVER_API_VERSION + `review-team-chair/desk-evaluation/view-progress/${reviewTeamId}/${deskEvaluationId}`;

    return await axios.get(URL);
}
export default GetDEprogress;