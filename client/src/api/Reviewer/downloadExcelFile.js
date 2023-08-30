import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: download the excel file template for reviewers

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/downloadExcelFile'
const downloadExcelFile = async () => {
    let URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/downloadExcelFile';

    return await axios.get(URL, {
        responseType: 'blob'
    });
}

export default downloadExcelFile;