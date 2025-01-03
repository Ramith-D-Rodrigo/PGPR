import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: recommend self evaluation report by id

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/recommendSelfEvaluationReport/'

const recommendSelfEvaluationReport = async (selfEvaluationReportId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/recommendSelfEvaluationReport/';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL);
}

export default recommendSelfEvaluationReport;