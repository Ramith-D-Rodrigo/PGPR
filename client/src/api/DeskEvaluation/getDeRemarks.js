import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: Display Given DE's remarks if marked
//reviewer display desk evaluation remarks (with scores if marked) +> URL params deskEvaluation=10&criteria=12&standard=8

//url is : SERVER_URL + SERVER_API_VERSION + '/reviewer/desk-evaluation/display-remarks'

const URL = SERVER_URL + SERVER_API_VERSION + '/reviewer/desk-evaluation/display-remarks';

const GetDeEvaluationScores = async () => {

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL);
}

export default GetDeEvaluationScores;