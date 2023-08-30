import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the applicable standards for a self evaluation report for a particular criteria id 

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/getStandards/{criteriaId}/'

const getStandardsForSER = async (selfEvaluationReportId, criteriaId) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/getStandards/' + criteriaId + '/';

    return await axios.get(URL);
}

export default getStandardsForSER;
