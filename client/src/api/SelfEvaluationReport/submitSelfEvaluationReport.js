import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit self evaluation report

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/submitSelfEvaluationReport'

const submitSelfEvaluationReport = async (selfEvaluationReportId, formData) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/submitSelfEvaluationReport';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData);
}

export default submitSelfEvaluationReport;