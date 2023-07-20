import {Link, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/api.js";
import "../styles/nav.css";

function Nav() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    // get the csrf-cookie
    try {
      axios.get("/sanctum/csrf-cookie");
      let response = await axios.post("/logout");
      console.log(response?.status);
      setAuth(null);
      navigate("/login");
    } catch (error) {
      if (!error?.response) {
        console.log("No Server Response");
      } else {
        console.log(error?.response);
      }
    }
  }

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to={"/home"}>Home</Link>
        </li>
        {auth && (
          <li>
            <Link onClick={handleLogout}>Logout</Link>
          </li>
        )}
        {!auth && (
          <li>
            <Link to={"/login"}>Sign in</Link>
          </li>
        )}
        {auth && (
            <li>
              <Link to={"/profile"}>Profile</Link>
            </li>
        )}<li>
          <Link to={"/register"}>Register</Link>
        </li>
        <li>
          <Link to={"/reviewer"}>Reviewer</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
