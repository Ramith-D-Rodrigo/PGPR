import {useState, useEffect} from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddDean from './AddDean';
import AddProgrammeCoordinator from './AddProgrammeCoordinator';
import AddIQAUDiretor from './AddIQAUDiretor';
import { Snackbar,Alert } from '@mui/material';
import createDean from '../../api/Dean/createDean';
import createProgrammeCoordinator from '../../api/ProgrammeCoordinator/createProgrammeCoordinator';
import createIQAUDirector from '../../api/IQAUDirector/createIQAUDirector';
import getCQADirectorUniversity from '../../api/CQADirector/getCQADirectorUniversity';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AddAccounts = () => {

  const {auth} = useAuth();
  const [value, setValue] = useState(0);
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uniId,setUniId] = useState('');
  const [faculties,setFaculties] = useState([]);

  useEffect(()=>{
    const getCQAUniiD = async()=>{
        setLoading(true);
        try{
          const result = await getCQADirectorUniversity(auth?.id);
          console.log("CQA university :",result?.data?.data);
          setUniId(result?.data?.data?.id);
          const result2 = await getUniversityFaculties(result?.data?.data?.id);
          console.log("CQA university faculties :",result2?.data?.data);
          setFaculties(result2?.data?.data);  
          setLoading(false);
        }
        catch(err)
        {
          console.log(err);
          //navigate to error page
          setLoading(false);
        }
    }
    document.title="Add Accounts | CQA";
    getCQAUniiD();
      
  },[]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useSetUserNavigations(
    [
        {
          name: "Manage Accounts",
          link: "/AddAccounts"
        },
      
    ]
);

const handleDeanSubmit = async(evt) => {
  evt.preventDefault();
  setLoading(true);

  const form = evt.target;
  let formData = new FormData(form);

  // for (const [key,value] of formData.entries()){
  //     console.log(`Key: ${key}, Value: ${value}`);
  // }
  try{
      const result = await createDean(formData);
      console.log(result);
      setSuccess(true);
      setLoading(false);
  }
  catch(error){
      console.log(error);
      setError(true);
      setMsg(error?.response?.data?.message);
      setLoading(false);
  }
}

const handleProgrammeCoordinatorSubmit = async(evt) => {
  evt.preventDefault();
  setLoading(true);

  const form = evt.target;
  let formData = new FormData(form);

  // for (const [key,value] of formData.entries()){
  //     console.log(`Key: ${key}, Value: ${value}`);
  // }

  try{
      const result = await createProgrammeCoordinator(formData);
      console.log(result);
      setSuccess(true);
      setLoading(false);
  }
  catch(error){
      console.log(error);
      setError(true);
      setMsg(error?.response?.data?.message);
      setLoading(false);
  }
}

const handleIQAUDirectorSubmit = async(evt) => {
  evt.preventDefault();
  setLoading(true);

  const form = evt.target;
  let formData = new FormData(form);

  // for (const [key,value] of formData.entries()){
  //     console.log(`Key: ${key}, Value: ${value}`);
  // }

  try{
    const result = await createIQAUDirector(formData);
    console.log(result);
    setSuccess(true);
    setLoading(false);
  }
  catch(error){
      console.log(error);
      setError(true);
      setMsg(error?.response?.data?.message);
      setLoading(false);
}
}

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{marginBottom: 5,display:"flex",justifyContent:"center",backgroundColor:'#D8E6FC' }}>
          <Tabs value={value} onChange={handleChange} aria-label="account add tabs">
            <Tab label="Add a Dean/Director" {...a11yProps(0)} />
            <Tab label="Add a Programme Coordinator" {...a11yProps(1)} />
            <Tab label="Add a IQAU director" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AddDean onSubmit={handleDeanSubmit} isLoading={loading} faculties={faculties}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AddProgrammeCoordinator onSubmit={handleProgrammeCoordinatorSubmit} isLoading={loading} faculties={faculties}/>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AddIQAUDiretor onSubmit={handleIQAUDirectorSubmit} isLoading={loading} faculties={faculties}/>
        </CustomTabPanel>
      </Box>

      <Snackbar
        open={error}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => {setError(false)}}
      >
        <Alert onClose={() => {setError(false)}} severity="error">
          {msg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={1500}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Created Successfully!
        </Alert>
      </Snackbar>

    </>
 
  );
};

export default AddAccounts;
