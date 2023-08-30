import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit self evaluation report

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/submitSelfEvaluationReport'

const submitSelfEvaluationReport = async (selfEvaluationReportId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/submitSelfEvaluationReport';

    return await axios.post(URL);
}

export default submitSelfEvaluationReport;