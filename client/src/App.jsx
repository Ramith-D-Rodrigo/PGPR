import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ViewSer from './pages/Reviewer/ViewSer';
import MainLayout from './components/MainLayout';
import NotFound from './pages/NotFound';
import AddPGProgramPage from './pages/QACdirector/AddPGProgramPage';
import AddAccounts from './pages/QACdirector/AddAccounts';

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
    "Import Reviewers" : "/qacofficer/importreviewers",
  }

  const qacDirectorRoutes = {
    "DashBoard": "/qacdirector/dashboard",
    "Add PG Program" : "/qacdirector/AddPGProgramPage",
    "Add Accounts" : "/qacdirector/AddAccounts",
  }

  //temporary
  const userRoutes = qacDirectorRoutes;//reviewerRoutes;
  const userBreadCrumbs = ["Home", "DashBoard"];//["Home", "DashBoard", "PG Assignment"];

  return (

    <Routes>
        <Route path="/">

            {/* guest routes */}
            <Route path="/login" element={<Login/>}/>


            <Route element={<MainLayout sideDrawerRoutes={userRoutes}/>}>
                
                <Route path="/qacofficer" >
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="universities" element={<Universities/>} />
                    <Route path="importreviewers" element={<ImportReviewers/>} />
                </Route>

                <Route path="/qacdirector" >
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="AddPGProgramPage" element={<AddPGProgramPage/>} />
                    <Route path="AddAccounts" element={<AddAccounts/>} />
                </Route>
                
                <Route path="/reviewer" >
                    <Route path="dashboard" element={<Dashboard/>}/>
                    <Route path="viewser" element={<ViewSer/>} />
                </Route>
            </Route>

            {/* 404 page & UnAuth ... */}
            <Route path="*" element={<NotFound/>}/>
        </Route>
    </Routes>
  );
}

export default App;
