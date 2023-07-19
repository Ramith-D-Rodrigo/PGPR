import {Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Reviewer from "./components/Reviewer";
import Authenticate from "./components/Authenticate";
import Unauthorized from "./components/Unauthorized";
import PageLayout from "./layouts/PageLayout";
import LoginPersist from "./components/LoginPersist.jsx";
import "./App.css";

function App() {
    return (
        // make changes as needed
        <Routes>
            <Route element={<PageLayout/>}>
                <Route path="/">
                    {/* guest routes */}
                    <Route path="login" element={<Login/>}/>
                    <Route path="landing" element={<Landing/>}/>
                    <Route path="unauthorized" element={<Unauthorized/>}></Route>

                    <Route element={<LoginPersist/>}>

                        {/* protected routes */}
                        <Route element={<Authenticate allowedRoles={["user", "reviewer", "qac"]}/>}>
                            {/* general user routes */}
                            <Route path="/" element={<Home/>}/>
                            <Route path="home" element={<Home/>}/>
                            <Route path="profile" element={<Profile/>}/>
                        </Route>


                        <Route
                            element={<Authenticate allowedRoles={["dean"]}/>}
                        >
                            {/* reviewer routes */}
                            <Route path="/" element={<Home/>}/>
                            <Route path="reviewer" element={<Reviewer/>}></Route>
                        </Route>


                        <Route
                            element={<Authenticate allowedRoles={["qac"]}/>}
                        >
                            {/* QACOfficer routes */}
                        </Route>
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
