import axios from "../api/api.js";
import useAuth from "./useAuth.js";

const useRefreshLogin = () => {
    const { setAuth } = useAuth();

    return async () => {

        await axios.get("/sanctum/csrf-cookie");
        let response = await axios.get('/api/user');
        console.log(response);
        setAuth(response?.data);
        console.log(response?.data);
        return response?.data;
    };
}

export default useRefreshLogin;