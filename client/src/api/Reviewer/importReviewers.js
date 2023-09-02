import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: import reviewers from a excel file

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewers/import'

const importReviewers = async (file) => {
    const formData = new FormData();    // create form data to send file
    formData.append('file', file);    // append file to form data

    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/import/';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export default importReviewers;