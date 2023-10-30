import axios from 'axios';
import { SERVER_URL, SERVER_API_VERSION } from '../../assets/constants.js';


//role of this function: assign reviewer role to other users
//params: none

//url is : SERVER_URL + SERVER_API_VERSION + 'assignReviewerRole'



// 'google_scholar_link' => ['required', 'string', 'url'],
// 'designation' => ['required', 'string'],
// 'qualification_1' => ['required', 'string', 'max:255'],
// 'qualification_1_slqf_level' => ['required', 'integer'],
// 'qualification_2' => ['required', 'string', 'max:255'],
// 'qualification_2_slqf_level' => ['required', 'integer'],
// 'qualification_3' => ['string', 'max:255', 'present', 'nullable'],
// 'qualification_3_slqf_level'=> ['integer', 'present', 'nullable'],
// 'qualification_4' => ['string', 'max:255', 'present', 'nullable'],
// 'qualification_4_slqf_level' => ['integer', 'present', 'nullable'],
// 'working_faculty' => ['required', 'integer', 'exists:faculties,id'],


const assignReviewerRole = async (params=null) => {
    const URL = SERVER_URL + SERVER_API_VERSION + 'assignReviewerRole';

    return params==null? axios.post(URL) : axios.post(URL, {...params});
}

export default assignReviewerRole;