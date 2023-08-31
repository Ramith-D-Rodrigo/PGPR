import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: get the evidences and the adherence to standards for a self evaluation report for a particular standard id

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/getStandardEvidencesAndAdherence/{standardId}/'

const getStandardEvidencesAndAdherenceForSER = async (selfEvaluationReportId, standardId) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/getStandardEvidencesAndAdherence/' + standardId + '/';

    return await axios.get(URL);
}

export default getStandardEvidencesAndAdherenceForSER;
