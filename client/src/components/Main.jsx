import { Outlet } from "react-router-dom";
import "../styles/main.css";

function Main() {
  return (
    <main className="main">
      <Outlet />
    </main>
  );
}

export default Main;
