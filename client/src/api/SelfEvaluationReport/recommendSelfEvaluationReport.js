import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: recommend self evaluation report by id

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/recommendSelfEvaluationReport/'

const recommendSelfEvaluationReport = async (selfEvaluationReportId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/recommendSelfEvaluationReport/';

    return await axios.post(URL);
}

export default recommendSelfEvaluationReport;