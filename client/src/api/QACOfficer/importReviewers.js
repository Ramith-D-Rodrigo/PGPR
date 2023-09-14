import axios from 'axios';
import { SERVER_URL, SERVER_API_VERSION } from '../../assets/constants.js';


//DEPRECATED FUNCTION

const URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/import/'; // build URL based on server URL and API

const importReviewers = async (file) => {
    const formData = new FormData();    // create form data to send file
    formData.append('file', file);    // append file to form data
    return axios.post(URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export default importReviewers;