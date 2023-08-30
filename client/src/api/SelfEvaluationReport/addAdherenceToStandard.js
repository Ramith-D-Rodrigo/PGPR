import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: add adherence to standard to self evaluation report

//url is : SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/{selfEvaluationReportId}/addAdherenceToStandards'

const addAdherenceToStandard = async (selfEvaluationReportId, adherenceToStandard) => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'selfEvaluationReports/' + selfEvaluationReportId + '/addAdherenceToStandards';

    return await axios.post(URL, adherenceToStandard);
}

export default addAdherenceToStandard;