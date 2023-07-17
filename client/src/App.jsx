import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Universities from './pages/QACOfficer/Universities';
import ImportReviewers from './pages/QACOfficer/ImportReviewers';
import MainLayout from './components/MainLayout';
import AddPGProgramPage from './pages/QACdirector/AddPGProgramPage';





function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/qacofficer/universities" element={<Universities/>} />
      <Route path="/qacofficer/importreviewers" element={<MainLayout mainContent={<ImportReviewers/>}/>} />
      <Route path="/QACdirector/AddPGProgramPage" element={<MainLayout mainContent={<AddPGProgramPage/>}/>} />
      
     

    </Routes>
  )
}

export default App
