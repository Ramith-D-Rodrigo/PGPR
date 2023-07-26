import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';
import NotFound from './pages/NotFound';
import Authenticate from "./components/Authenticate";
import Unauthorized from "./components/Unauthorized";
import LoginPersist from "./components/LoginPersist.jsx";
import PGPRApplication from './pages/Dean/PGPRApplication';
import ResetInitialPassword from "./components/ResetInitialPassword.jsx";
import "./App.css";
import "./App.css";

/* 
  important: 
  please check before merge whether the import paths duplicated
  & please use the correct import path.
  if there is no imported path similar to the import path(by you), please remove the import path
  & instead do the changes into file already in there.
*/
import EditPGProgram from './pages/CQAdirector/EditPGProgram';
import SubmitIntent from './pages/DeanDirector/SubmitIntent';
import SubmitConsent from './pages/DeanDirector/SubmitConsent';
import SetDate from './pages/ReviewerChair/SetDate';
import SetCriteria from './pages/ReviewerChair/SetCriteria';


function App() {

  //Demo routes for side drawer
  //fetch from backend using loged in user type
  const reviewerRoutes = {
    "DashBoard": "/reviewer/dashboard",
    "PG Assignment" : "/reviewer/viewser",
  }
  const qacOfficerRoutes = {
    "DashBoard": "/qacofficer/dashboard",
    "Universities" : "/qacofficer/universities",
    //"Import Reviewers" : "/qacofficer/importreviewers",
  }

  const cqaDirectorRoutes = {
    "DashBoard": "/",
    "Add PG Program" : "/cqadirector/AddPGProgramPage",
    "Add Accounts" : "/cqadirector/AddAccounts",
    "Edit PG Program" : "/cqadirector/EditPGProgram",
  }

  const deanDirectorRoutes = {
    "DashBoard": "/",
    "Submit Intent Letter" : "/dean/SubmitIntent",
    "Submit Consent" : "/dean/SubmitConsent",
  }

  const reviewerChairRoutes = {
    "DashBoard": "/qacdirector/dashboard",
    "Set Date" : "/reviewerchair/SetDate",
    "Set Criteria" : "/reviewerchair/SetCriteria",
  }


  //temporary
  const userRoutes = qacDirectorRoutes;//reviewerRoutes;
  const userBreadCrumbs = ["Home", "DashBoard"];//["Home", "DashBoard", "PG Assignment"];

  return (

    <Routes>
        <Route path="/">
            {/* guest routes */}
            <Route path="unauthorized" element={<Unauthorized/>}></Route>

            <Route element={<LoginPersist/>}>
              
              {/* initial login password change component and the routes*/}
             <Route path="initial-password-reset" element={<ResetInitialPassword />}/>
             {/*note: note final*/}
             <Route path="login" element={<Login/>}/>
             <Route path="/" element={<Login/>}/>
              
             <Route element={<MainLayout sideDrawerRoutes={userRoutes}/>}>
                
                {/* protected routes */}

                <Route element={<Authenticate allowedRoles={["user", "reviewer", "qac"]}/>}>
                  <Route path="qacofficer/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                      <Route path="universities" element={<Universities/>} />
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["user", "reviewer", "qac"]}/>}>
                  <Route path="qacdirector/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                      <Route path="AddPGProgramPage" element={<AddPGProgramPage/>} />
                      <Route path="AddAccounts" element={<AddAccounts/>} />
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["user", "reviewer", "qac"]}/>}>
                  <Route path="reviewer/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                      <Route path="viewser" element={<ViewSer/>} />
                  </Route>
                </Route>

                {/* dean routes */}
                <Route element={<Authenticate allowedRoles={["dean"]}/>}>
                  <Route path="dean/">
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                  </Route>
                </Route>

                {/* iqau routes */}
                <Route element={<Authenticate allowedRoles={["iqau_director"]}/>}>
                  <Route path="iqau_director/">
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                  </Route>
                </Route>
              </Route>

            </Route>
            {/* 404 page & UnAuth ... */}
            <Route path="*" element={<NotFound/>}/>
        </Route>
    </Routes>
  );
}

export default App;
