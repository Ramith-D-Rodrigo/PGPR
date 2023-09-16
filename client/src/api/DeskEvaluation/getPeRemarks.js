import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: Display Given PE's Remarks if marked
//reviewer display proper evaluation remarks (with scores if marked) +> URL params properEvaluation=10&criteria=12&standard=8

//url is : SERVER_URL + SERVER_API_VERSION + '/reviewer/proper-evaluation/display-remarks'

const URL = SERVER_URL + SERVER_API_VERSION + '/reviewer/proper-evaluation/display-remarks';

const GetPeEvaluationScores = async () => {

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests
    return await axios.post(URL);
}

export default GetPeEvaluationScores;