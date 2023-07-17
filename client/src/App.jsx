import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Universities from './pages/QACOfficer/Universities';
import ImportReviewers from './pages/QACOfficer/ImportReviewers';
import MainLayout from './components/MainLayout';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/qacofficer/universities" element={<Universities/>} />
      <Route path="/qacofficer/importreviewers" element={<MainLayout mainContent={<ImportReviewers/>}/>} />
    </Routes>
  )
}

export default App
