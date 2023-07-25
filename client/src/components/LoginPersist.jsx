import {Outlet} from "react-router-dom";
import useRefreshLogin from "../hooks/useRefreshLogin.js";
import useAuth from "../hooks/useAuth.js";
import {useState, useEffect} from 'react';

const LoginPersist = () => {
    const {auth} = useAuth();
    const refresh = useRefreshLogin();
    const [isPageLoading, setIsPageLoading] = useState(true);

    // if the page was refreshed then aat the time of loading
    useEffect(() => {
        let mounted = true;
        const verifyUser = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                mounted && setIsPageLoading(false);
                // setIsPageLoading(false);
            }
        }

        !auth ? verifyUser() : setIsPageLoading(false);
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        // set a spinner to indicate loading in here
        console.log(`Page loading :${isPageLoading}`)
    }, [isPageLoading]);

    return (
        <>
            {
                isPageLoading ? <p>Loading...</p> : <Outlet/>
            }
        </>
    );
}

export default LoginPersist;
