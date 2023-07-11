import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import Authenticate from "./components/Authenticate";
import Unauthorized from "./components/Unauthorized";
import PageLayout from "./layouts/PageLayout";
import "./App.css";

function App() {
  return (
    // make changes as needed
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/">
          {/* guest routes */}
          <Route path="/" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="landing" element={<Landing />} />
          {/* protected routes */}
          <Route element={<Authenticate allowedRoles={["user"]} />}>
            {/* general user routes */}
            <Route path="profile" element={<Profile />} />
            {/* reviewer routes */}
            <Route
              element={<Authenticate allowedRoles={["reviewer"]} />}
            ></Route>
            {/* QACOfficer routes */}
            <Route
              element={<Authenticate allowedRoles={["QACOfficer"]} />}
            ></Route>
            {/* and so on */}
          </Route>
          <Route path="unauthorized" element={<Unauthorized />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
