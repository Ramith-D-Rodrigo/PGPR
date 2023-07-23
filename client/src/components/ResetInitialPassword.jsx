import axios from "../api/api.js";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useRefreshLogin from "../hooks/useRefreshLogin.js";

const InitialPasswordRest = () => {

    const userInputRef = useRef(); // used to set the focus on inputs
    const errorRef = useRef(); // in case of input error set the focus on them
    const { auth } = useContext(AuthContext);
    const refresh = useRefreshLogin();

    // this should go to the LoginContext.js
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // navigations
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; // where the use got here

    console.log(auth);

    async function handlePasswordReset(event) {
        event.preventDefault();
        try {
            // get the CSRF-cookie
            await axios.get("/sanctum/csrf-cookie");
            await axios.post(
                "/initial-password-reset",
                // payload
                {
                    officialEmail: auth?.officialEmail,
                    password,
                    passwordConfirmation,
                },
            );
            await refresh();

           setPassword("");
           setPasswordConfirmation("");
           alert("Password Successfully Changed");
           navigate(from, { replace: true }); // navigate to the intended page
        } catch (error) {
            console.error(error?.response);
            if (!error?.response) {
                setErrorMsg("No Server Response");
            } else {
                console.log(error.response);
                let { message, errors } =  error.response?.data || "An unknown error occurred";
                console.log(errors);
                setErrorMsg(message);
            }
            errorRef.current.focus();
        }
    }

    useEffect(() => {
        userInputRef.current.focus();
    }, []);

    // when loading set the messages to empty strings
    useEffect(() => {
        setErrorMsg("");
    }, [password, passwordConfirmation]);

    return (
        <section>
            <p ref={errorRef}>{errorMsg}</p>
            <h1>Reset Password</h1>
            <p>This is your first login please change your password to proceed.</p>
            <form onSubmit={handlePasswordReset}>
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    name="reset-passowrd"
                    ref={userInputRef}
                    autoComplete="off"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    value={password}
                    required
                ></input>
                <label htmlFor="password-confirmation">Confirm the password: </label>
                <input
                    type="password"
                    id="password-confirmation"
                    name="reset-password-confirmation"
                    onChange={(e) => {
                        setPasswordConfirmation(e.target.value);
                    }}
                    value={passwordConfirmation}
                    required
                ></input>
                <button>Change Password</button>
            </form>
        </section>
    );
}

export default InitialPasswordRest;
