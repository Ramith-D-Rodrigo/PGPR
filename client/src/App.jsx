import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';
import NotFound from './pages/NotFound';
import AddPGProgramPage from './pages/QACdirector/AddPGProgramPage';
import AddAccounts from './pages/QACdirector/AddAccounts';
//
import Authenticate from "./components/Authenticate";
import Unauthorized from "./components/Unauthorized";
import LoginPersist from "./components/LoginPersist.jsx";

import ResetInitialPassword from "./components/ResetInitialPassword.jsx";
import "./App.css";
import ImportReviewers from "./api/QACOfficer/importReviewers.js";

function App() {

    //Demo routes for side drawer
    //fetch from backend using loged in user type
    const reviewerRoutes = {
        "DashBoard": "/reviewer/dashboard",
        "PG Assignment": "/reviewer/viewser",
    }
    const qacOfficerRoutes = {
        "DashBoard": "/qacofficer/dashboard",
        "Universities": "/qacofficer/universities",
        "Import Reviewers": "/qacofficer/importreviewers",
    }

    const qacDirectorRoutes = {
        "DashBoard": "/qacdirector/dashboard",
        "Add PG Program": "/qacdirector/AddPGProgramPage",
        "Add Accounts": "/qacdirector/AddAccounts",
    }

    //temporary
    const userRoutes = qacDirectorRoutes;//reviewerRoutes;
    const userBreadCrumbs = ["Home", "DashBoard"];//["Home", "DashBoard", "PG Assignment"];

    return (

        <Routes>
            <Route path="/">
                {/* guest routes */}
                <Route path="/login" element={<Login/>}/>
                <Route path="unauthorized" element={<Unauthorized/>}></Route>

                <Route element={<LoginPersist/>}>
                    // initial login password change component and the routes
                    <Route path="initial-password-reset" element={<ResetInitialPassword/>}/>

                    <Route element={<MainLayout sideDrawerRoutes={userRoutes}/>}>

                        {/* protected routes */}

                        {/* DEAN ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["dean"]}/>}>
                            <Route path="dean/">
                                {/* Add the routes here */}
                            </Route>
                        </Route>

                        {/* PROGRAM COORDINATOR ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["pc"]}/>}>
                            <Route path="program-coordinator/">
                                {/* Add the routes here */}
                            </Route>
                        </Route>

                        {/* VICE CHANCELLOR ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["vc"]}/>}>
                            <Route path="vice-chancellor/">
                                {/* Add the routes here */}
                            </Route>
                        </Route>

                        {/* REVIEWER ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["reviewer"]}/>}>
                            <Route path="reviewer/">
                                {/* Add the routes here */}
                            </Route>
                        </Route>

                        {/* QAC OFFICER ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["qac"]}/>}>
                            <Route path="qacofficer/">
                                <Route path="dashboard" element={<Dashboard/>}/>
                                <Route path="universities" element={<Universities/>}/>
                                <Route path="importreviewers" element={<ImportReviewers/>}/>
                            </Route>
                        </Route>

                        {/* QAC DIRECTOR ROUTES ... */}
                        <Route element={<Authenticate allowedRoles={["qac"]}/>}>
                            <Route path="reviewer/">
                                {/* Add the routes here */}
                            </Route>
                        </Route>
                    </Route>
                    {/* 404 page & UnAuth ... */}
                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
