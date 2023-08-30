import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: import reviewers from a excel file

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/import'

const importReviewers = async (file) => {
    const formData = new FormData();    // create form data to send file
    formData.append('file', file);    // append file to form data

    let URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/import/';

    return await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export default importReviewers;