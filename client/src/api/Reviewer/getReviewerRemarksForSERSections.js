import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the remarks of a reviewer for the sections of a self evaluation report

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/pgpr/ser-remarks/view/{serId}'

const getReviewerRemarksForSERSections = async (selfEvaluationReportId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/pgpr/ser-remarks/view/' + selfEvaluationReportId;

    return await axios.get(URL, {serId: selfEvaluationReportId});
}

export default getReviewerRemarksForSERSections;