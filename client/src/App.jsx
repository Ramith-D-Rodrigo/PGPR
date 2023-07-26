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
import AddPGProgramPage from './pages/CQAdirector/AddPGProgramPage';
import AddAccounts from './pages/CQAdirector/AddAccounts';
import EditPGProgram from './pages/CQAdirector/EditPGProgram';
import SubmitIntent from './pages/DeanDirector/SubmitIntent';
import SubmitConsent from './pages/DeanDirector/SubmitConsent';
import SetDate from './pages/ReviewerChair/SetDate';
import SetCriteria from './pages/ReviewerChair/SetCriteria';
import "./App.css";

/* 
  important: 
  please check before merge whether the import paths duplicated
  & please use the correct import path.
  if there is no imported path similar to the import path(by you), please remove the import path
  & instead do the changes into file already in there.
*/


function App() {

  //Demo routes for side drawer
  //fetch from backend using loged in user type
  const reviewerRoutes = [
    {route:"DashBoard",link: "/reviewer/dashboard"},
    {route:"PG Assignment" ,link: "/reviewer/viewser"},
    {route:"Set Date" ,link: "/reviewerchair/SetDate"},
    {route:"Set Criteria" ,link: "/reviewerchair/SetCriteria"},
  ]

  const qacDirectorRoutes = [
    {route:"DashBoard",link: "/qac_director/dashboard"},
    {route:"Add PG Program" ,link: "/qac_director/AddPGProgramPage"},
    {route:"Add Accounts" ,link: "/qac_director/AddAccounts"},
  ]

  const qacOfficerRoutes = [
    {route:"DashBoard",link: "/qac_officer/dashboard"},
    {route:"Universities" ,link: "/qac_officer/universities"},
    //{route:"Import Reviewers" ,link: "/qac_officer/importreviewers"},
]

  const cqaDirectorRoutes = [
    {route:"DashBoard",link: "/"},
    {route:"Add PG Program" ,link: "/cqa_director/AddPGProgramPage"},
    {route:"Add Accounts" ,link: "/cqa_director/AddAccounts"},
    {route:"Edit PG Program" ,link: "/cqa_director/EditPGProgram"},
  ]

  const deanDirectorRoutes = [
    {route:"DashBoard",link: "/"},
    {route:"Submit Intent Letter" ,link: "/dean/SubmitIntent"},
    {route:"Submit Consent" ,link: "/dean/SubmitConsent"},
  ]


  //temporary
  const userRoutes = qacDirectorRoutes;//reviewerRoutes;
  const userBreadCrumbs = [
    {name:"Home",link:"/"}, 
    {name:"DashBoard",link:"/"},
  ];//["Home", "DashBoard", "PG Assignment"];

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
              
             <Route element={<MainLayout sideDrawerRoutes={userRoutes} navigationBreadCrumbs={userBreadCrumbs}/>}>
                
                {/* protected routes */}

                <Route element={<Authenticate allowedRoles={["qac_officer"]}/>}>
                  <Route path="qac_officer/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                      <Route path="universities" element={<Universities/>} />
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["cqa_director"]}/>}>
                  <Route path="cqa_director/" >
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="AddPGProgramPage" element={<AddPGProgramPage/>} />
                    <Route path="AddAccounts" element={<AddAccounts/>} />
                    <Route path="EditPGProgram" element={<EditPGProgram/>} />
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["qac_director"]}/>}>
                  <Route path="qac_director/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["reviewer"]}/>}>
                  <Route path="reviewer/" >
                      <Route path="" element={<Dashboard/>}/>
                      <Route path="dashboard" element={<Dashboard/>}/>
                      <Route path="viewser" element={<ViewSer/>} />
                      <Route path="SetDate" element={<SetDate/>} />
                      <Route path="SetCriteria" element={<SetCriteria/>} />
                  </Route>
                </Route>

                {/* dean routes */}
                <Route element={<Authenticate allowedRoles={["dean"]}/>}>
                  <Route path="dean/">
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="SubmitIntent" element={<SubmitIntent/>} />
                    <Route path="SubmitConsent" element={<SubmitConsent/>} />
                  </Route>
                </Route>

                {/* iqau routes */}
                <Route element={<Authenticate allowedRoles={["iqau_director"]}/>}>
                  <Route path="iqau_director/">
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["programme_coordinator"]}/>}>
                  <Route path="programme_coordinator/">
                    <Route path="" element={<Dashboard/>}/>
                    <Route path="dashboard" element={<Dashboard/>}/>
                  </Route>
                </Route>

                <Route element={<Authenticate allowedRoles={["vice_chancellor"]}/>}>
                  <Route path="vice_chancellor/">
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
