import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get self evaluation report by id

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}'

const getSelfEvaluationReport = async (selfEvaluationReportId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId;

    return await axios.get(URL);
}

export default getSelfEvaluationReport;