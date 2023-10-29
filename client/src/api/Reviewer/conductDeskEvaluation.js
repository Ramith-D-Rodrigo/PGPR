import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from "../api.js";

//role of this function: submit desk evaluation remarks and score for a standard of a criteria of a pgpr

//url is : SERVER_URL + SERVER_API_VERSION + 'reviewer/conduct/desk-evaluation'

const conductDeskEvaluation = async (pgprId,criteriaId,standardId,observations,score) => {
    const formData = new FormData();    // create form data to send file

    formData.append('pgprId',pgprId);    // append pgprId to form data
    formData.append('criteriaId',criteriaId);    // append criteriaId to form data
    formData.append('standardId',standardId);    // append standardId to form data
    formData.append('observations',observations);    // append comment to form data
    formData.append('score',score);    // append score to form data

    //     pgprId: 10,
    //     criteriaId: 10,
    //     standardId: 10,
    //     comment: "This is marvelous",
    //     score: 0 <= x <= 3

    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewer/conduct/desk-evaluation';

    await axios.get("/sanctum/csrf-cookie"); //csrf-cookie is required for post requests

    return await axios.post(URL, formData);
}

export default conductDeskEvaluation;