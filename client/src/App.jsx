import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ImportReviewers from './pages/QACOfficer/ImportReviewers';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';
import NotFound from './pages/NotFound';
import AddPGProgramPage from './pages/QACdirector/AddPGProgramPage';
import AddAccounts from './pages/QACdirector/AddAccounts';
import EditPGProgram from './pages/QACdirector/EditPGProgram';
import SubmitIntent from './pages/DeanDirector/SubmitIntent';
import SubmitConsent from './pages/DeanDirector/SubmitConsent';
import SetDate from './pages/ReviewerChair/SetDate';
import SetCriteria from './pages/ReviewerChair/SetCriteria';


function App() {

  //Demo routes for side drawer
  //fetch from backend using loged in user type
  const reviewerRoutes = {
    "DashBoard": "/",
    "PG Assignment" : "/reviewer/viewser",
  }
  const qacOfficerRoutes = {
    "DashBoard": "/",
    "Universities" : "/qacofficer/universities",
    "Import Reviewers" : "/qacofficer/importreviewers",
  }

  const qacDirectorRoutes = {
    "DashBoard": "/",
    "Add PG Program" : "/qacdirector/AddPGProgramPage",
    "Add Accounts" : "/qacdirector/AddAccounts",
    "Edit PG Program" : "/qacdirector/EditPGProgram",
  }

  const deanDirectorRoutes = {
    "DashBoard": "/",
    "Submit Intent Letter" : "/deandirector/SubmitIntent",
    "Submit Consent" : "/deandirector/SubmitConsent",
  }

  const reviewerChairRoutes = {
    "DashBoard": "/",
    "Set Date" : "/reviewerchair/SetDate",
    "Set Criteria" : "/reviewerchair/SetCriteria",
  }


  //temporary
  const userRouts = reviewerRoutes;

  return (
    // <Routes>
    //   <Route path="/" element={<Dashboard/>}/>
    //   <Route path="/login" element={<Login/>}/>
    //   <Route path="/qacofficer/universities" element={<Universities/>} />
    //   <Route path="/qacofficer/importreviewers" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<ImportReviewers/>}/>} />
    //   <Route path="/reviewer/viewser" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} />
    // </Routes>

    <Routes>
      <Route path="/" element={<MainLayout sideDrawerRoutes={userRouts} mainContent={<Dashboard/>}/>}/>
      <Route path="/login" element={<Login/>}/>

      <Route path="/qacofficer" >
        <Route path="universities" element={<Universities/>} />
        <Route path="importreviewers" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<ImportReviewers/>}/>} />
      </Route>

      <Route path="/qacdirector" >
        <Route path="AddPGProgramPage" element={<MainLayout sideDrawerRoutes={qacDirectorRoutes} mainContent={<AddPGProgramPage/>}/>} />
        <Route path="AddAccounts" element={<MainLayout sideDrawerRoutes={qacDirectorRoutes} mainContent={<AddAccounts/>}/>} />
        <Route path="EditPGProgram" element={<MainLayout sideDrawerRoutes={qacDirectorRoutes} mainContent={<EditPGProgram/>}/>} />
      </Route>
      
      <Route path="/reviewer" >
        <Route path="viewser" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} />
      </Route>

      <Route path="/deandirector" >
        <Route path="SubmitIntent" element={<MainLayout sideDrawerRoutes={deanDirectorRoutes} mainContent={<SubmitIntent/>}/>} />
        <Route path="SubmitConsent" element={<MainLayout sideDrawerRoutes={deanDirectorRoutes} mainContent={<SubmitConsent/>}/>} />
      </Route>

      <Route path="/reviewerchair" >
        <Route path="SetDate" element={<MainLayout sideDrawerRoutes={reviewerChairRoutes} mainContent={<SetDate/>}/>} />
        <Route path="SetCriteria" element={<MainLayout sideDrawerRoutes={reviewerChairRoutes} mainContent={<SetCriteria/>}/>} />
      </Route>

      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default App
