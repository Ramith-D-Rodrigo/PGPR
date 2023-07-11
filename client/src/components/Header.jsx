import { Link } from "react-router-dom";
import "../styles/header.css";
import Nav from "./Nav";

function Header() {
  return (
    <header className="header">
      <p>
        <Link to={"/"}>Post Graduate Review Program</Link>
      </p>
      <Nav></Nav>
    </header>
  );
}

export default Header;
