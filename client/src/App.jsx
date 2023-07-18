import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ImportReviewers from './pages/QACOfficer/ImportReviewers';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';
import NotFound from './pages/NotFound';

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

      <Route path="/qacofficer" element={<Universities/>} >
        <Route path="universities" element={<Universities/>} />
        <Route path="importreviewers" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<ImportReviewers/>}/>} />
      </Route>

      <Route path="/qacdirector" element={<Universities/>} >
      </Route>
      
      <Route path="/reviewer" >
        <Route path="viewser" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} />
      </Route>

      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}

export default App
