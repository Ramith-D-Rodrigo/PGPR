import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/api.js";

function Nav() {
  const { user } = useAuth();

  function handleLogout() {
    // get the csrf-cookie
    try {
      axios.get("/sanctum/csrf-cookie");
      let response = axios.post("/logout");
      console.log(response.status);
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
        {user && (
          <li>
            <Link onClick={logout}>Logout</Link>
          </li>
        )}
        {!user && (
          <li>
            <Link to={"/login"}>Sign in</Link>
          </li>
        )}
        <li>
          <Link to={"/register"}>Register</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
