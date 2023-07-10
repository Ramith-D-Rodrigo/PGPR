import './App.css'
import {Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Universities from './pages/QACOfficer/Universities';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/qacofficer/universities" element={<Universities/>} />
    </Routes>
  )
}

export default App
