import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import axios from "../api.js";

//DEPRECATED FUNCTION

const URL = SERVER_URL + SERVER_API_VERSION + 'postGraduatePrograms';

const getPostGraduateProgrammes = async () => {
    
    return await axios.get(URL, {
        //add the parameters to the URL
    })
    
}

export default getPostGraduateProgrammes;
