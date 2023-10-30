import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: Display Current DEs of the Reviewer

//url is : SERVER_URL + SERVER_API_VERSION + '/reviewers/reviewer-proper-evaluations'

const URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/reviewer-proper-evaluations';

const GetAllPeEvaluations = async () => {

    return await axios.get(URL);
}

export default GetAllPeEvaluations;