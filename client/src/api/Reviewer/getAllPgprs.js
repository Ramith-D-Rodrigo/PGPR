import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import axios from '../api.js';


// role of this function : get all the pgprs of the reviewer

//url = reviewers/pgprs

export default getAllPgprs = async()=>
{
    const URL = SERVER_URL + SERVER_API_VERSION + 'reviewers/pgprs';
    return await axios.post(URL);
}