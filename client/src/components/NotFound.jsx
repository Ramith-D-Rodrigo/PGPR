import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const NotFound = () => {
    const navigate = useNavigate();

    // incase the user wants to go to the previous location
    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>404 Page Not Found.</h1>
            <br />
            <p>The page you request cannot be found.</p>
            <button onClick={goBack}>Go Back</button>
        </section>
    );
};

export default NotFound;
