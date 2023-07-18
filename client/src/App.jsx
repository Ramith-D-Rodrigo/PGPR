import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ImportReviewers from './pages/QACOfficer/ImportReviewers';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';

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

  return (
    // <Routes>
    //   <Route path="/" element={<Dashboard/>}/>
    //   <Route path="/login" element={<Login/>}/>
    //   <Route path="/qacofficer/universities" element={<Universities/>} />
    //   <Route path="/qacofficer/importreviewers" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<ImportReviewers/>}/>} />
    //   <Route path="/reviewer/viewser" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} />
    // </Routes>

    <Routes>
      <Route path="/" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<Dashboard/>}/>}/>
      <Route path="/login" element={<Login/>}/>

      <Route path="/qacofficer" element={<Universities/>} >
        <Route path="/qacofficer/universities" element={<Universities/>} />
        <Route path="/qacofficer/importreviewers" element={<MainLayout sideDrawerRoutes={qacOfficerRoutes} mainContent={<ImportReviewers/>}/>} />
      </Route>
      
      <Route path="/reviewer" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} >
        <Route path="/reviewer/viewser" element={<MainLayout sideDrawerRoutes={reviewerRoutes} mainContent={<ViewSer/>}/>} />
      </Route>
    </Routes>
  )
}

export default App
