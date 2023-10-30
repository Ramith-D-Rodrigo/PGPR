import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the criteria with scores and comments for a reviewer
// url = review-team-chair/desk-evaluation/reviewer/display-remarks-score
// reviewer display the criteria with scores and comments +> URL params pgpr=10&reviewer=12 or pgpr=10&reviewer=12&criteria=10 or pgpr=10&reviewer=12&criteria=10&standard=9


const getReviewedCriteriawithScoresofReviewer = async (pgprId,reviewer,criteriaId=null) => {
    
    const URL = SERVER_URL + SERVER_API_VERSION + `review-team-chair/desk-evaluation/reviewer/display-remarks-scores?pgpr=${pgprId}&reviewer=${reviewer}${criteriaId == null? '' : '&criteria='+criteriaId}`;

    return await axios.get(URL);
}
export default getReviewedCriteriawithScoresofReviewer;