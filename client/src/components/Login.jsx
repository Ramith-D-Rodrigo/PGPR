// NO MUI JUST BASICS +> BEAUTIFYING NEEDS TO BE DONE
// change as needed the basics are added here
import {useRef, useState, useEffect, useContext} from "react";
import axios from "../api/api.js";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useNavigate, useLocation} from "react-router-dom";

const Login = () => {
    const userInputRef = useRef(); // used to set the focus on inputs
    const errorRef = useRef(); // in case of input error set the focus on them
    const {auth, setAuth} = useContext(AuthContext);

    // this should go to the LoginContext.js
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // navigations
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; // where the use got here

    async function handleLogin(event) {
        event.preventDefault();
        try {
            // get the CSRF-cookie
            await axios.get("/sanctum/csrf-cookie");
            let response = await axios.post(
                "/login",
                // payload
                {
                    officialEmail: email,
                    loginAs: 'reviewer',
                    password,
                },
            );
            // don't wrap the return value in the backend with the Response()
            // the returned data won't be in this format
            setAuth(response.data);
            setEmail("");
            setPassword("");
            setRole("");

            if (response.data.initialLogin === true) {
                navigate('/initial-password-reset', {replace: true}); // this login will be pushed to the history
            } else {
                navigate(from, {replace: true}); // this login will be pushed to the history
            }
        } catch (error) {
            console.error(error?.response);
            if (!error?.response) {
                // check if the request went through to the server
                setErrorMsg("No Server Response");
            } else {
                // read the errors
                console.log(error.response);
                let {message, errors} = error.response?.data || "An unknown error occurred";
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
    }, [email, password]);

    return (
        <section>
            <p ref={errorRef}>{errorMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleLogin}>
                <label htmlFor="emailAddress">Email: </label>
                <input
                    type="email"
                    id="emailAddress"
                    name="name"
                    ref={userInputRef}
                    autoComplete="off"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    value={email} // to reset the input field
                    required
                ></input>
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    value={password}
                    required
                ></input>
                <button>Submit</button>
            </form>
        </section>
    );
};

export default Login;
