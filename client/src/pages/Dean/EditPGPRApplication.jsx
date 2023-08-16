import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import { TextField, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select,Snackbar,Alert, Box, Typography } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText';
import axios from '../../api/api.js';
// import handlePGPRApplicationCreation from '../../api/Dean/handlePGPRApplicationCreation';
import getPostGraduateProgrammes from '../../api/Dean/getPostGraduateProgrammes';
import { useState, useEffect, useRef } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function EditPGPRApplication() {

    const {pgprApplicationID} = useParams();

  useSetUserNavigations(
    [
        {
          name: "PGPR Applications",
          link: "/PGPRApplications"
        },
        {
          name: "Edit PGPR Application",
          link: "/PGPRApplications/edit/"+pgprApplicationID
        },
      
    ]
  );
    
    const navigate = useNavigate();
    const [year1, setYear1] = useState("");
    const [year2, setYear2] = useState("");
    const [year3, setYear3] = useState("");
    const [year4, setYear4] = useState("");
    const [year5, setYear5] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [selectedPGP,setSelectedPGP] = useState({});
    const [intentLetter, setIntentLetter] = useState(null);

    // let selectedPGP = useRef("");
    // let selectedSLQFLevel = useRef("");

    useEffect(() => {
      
      const getPGPRApplication = async() => {
        setLoading(true);
        setErrorMsg(false);
        setSuccess(false);
        const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/' + pgprApplicationID;
        // await axios.get("/sanctum/csrf-cookie");
        await axios.get(URL).then((res) => {
        //   console.log("res : ",res);
          setLoading(false);
          if(res.status == 200)
          {
            const response = res.data.data;
            setSelectedPGP(response);
            console.log("response : ",response);
            setYear1(response.year1);
            setYear2(response.year2);
            setYear3(response.year3);
            setYear4(response.year4);
            setYear5(response.year5);
            setYearEnd(response.yEnd);
          }
          
        }).catch((err) => {
          console.log("err : ",err);
          console.log(err?.response?.data?.message);
          setLoading(false);
          setErrorMsg(err?.response?.data?.message);
        });
      }
      getPGPRApplication();
    }, []);

    useEffect(()=>{
      setErrorMsg("");
    },[year1,year2,year3,year4,year5,yearEnd,intentLetter])

    const handleSubmitApplication = async(event) => {
      event.preventDefault();
      setLoading(true);
      //validate the data
      if(year1 === "" || year2 === "" || year3 === "" || year4 === "" || year5 === "" || yearEnd === ""){
        setErrorMsg("All years Required");
        setLoading(false);
        return;
      }
      else if(year1 < 0 || year2 < 0 || year3 < 0 || year4 < 0 || year5 < 0){
        setErrorMsg("Years can't be negative");
        setLoading(false);
        return;
      }
      else if(year1 > year2 || year2 > year3 || year3 > year4 || year4 > year5){
        setErrorMsg("Year 2 should be greater than year 1 and so on");
        setLoading(false);
        return;
      }
      const URL = SERVER_URL + SERVER_API_VERSION + 'pgprApplications/'+pgprApplicationID;
      let data = {};
        if(year1 !== selectedPGP.year1) data.year_1 = year1;
        if(year2 !== selectedPGP.year2) data.year_2 = year2;
        if(year3 !== selectedPGP.year3) data.year_3 = year3;
        if(year4 !== selectedPGP.year4) data.year_4 = year4;
        if(year5 !== selectedPGP.year5) data.year_5 = year5;
        if(yearEnd !== selectedPGP.yEnd) data.yEnd = yearEnd;
        if(intentLetter!== null && intentLetter !== selectedPGP.intentLetter) data.intentLetter = intentLetter;
      console.log("data : ",data);

        const formdata = new FormData();
        for (const key in data) {
            formdata.append(key, data[key]);
        }
        formdata.append("_method", "PATCH");

        if(Object.keys(data).length === 0){
            setErrorMsg("No changes made");
            setLoading(false);
            return;
        }
      
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(URL, formdata).then((res) => {
        console.log("res : ",res);
        setLoading(false);
        if(res.status == 200)
        {
          console.log("saved successfully");
          setSuccess(true);
          setTimeout(()=>{
            navigate('../');
          },1500)
        }
        
      }).catch((err) => {
        console.log("err : ",err);
        console.log(err?.response?.data?.message);
        setLoading(false);
        setErrorMsg(err?.response?.data?.message);
      });
    }

    const handleFileChange = (event) => {
        setIntentLetter(event.target.files[0]);
        // console.log("intentLetter",event.target.files[0]);
      };

    const disabled = loading? {disabled:true} : {disabled:false};


  return (
    <>

        <Typography align='center' margin={2}  variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Edit PGPR Application
        </Typography>
        <form onSubmit={handleSubmitApplication} style={{display:"flex",flexDirection:"column",flexWrap:'wrap',width:'100%',justifyContent:'center',alignItems:'center'}}>

            <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'flex-start',alignItems:'center',width:'100%'}}>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year1-label">Year 1</InputLabel>
                <Input id="year1" {...disabled} type='number' value={year1} onChange={(e) => setYear1(e.target.value)} required/>
                <FormHelperText>Edit the Year 1</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year2-label">Year 2</InputLabel>
                <Input {...disabled} id="year2" type='number' value={year2} onChange={(e) => setYear2(e.target.value)} required/>
                <FormHelperText>Edit the Year 2</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year3-label">Year 3</InputLabel>
                <Input {...disabled} id="year3" type='number' value={year3} onChange={(e) => setYear3(e.target.value)} required/>
                <FormHelperText>Edit the Year 3</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year4-label">Year 4</InputLabel>
                <Input {...disabled} id="year4" type='number' value={year4} onChange={(e) => setYear4(e.target.value)} required/>
                <FormHelperText>Edit the Year 4</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year5-label">Year 5</InputLabel>
                <Input {...disabled} id="year5" type='number' value={year5} onChange={(e) => setYear5(e.target.value)} required/>
                <FormHelperText>Edit the Year 5</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <Input {...disabled} id="yearEnd" type='date' value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} required/>
                <FormHelperText>Edit the Year End</FormHelperText>
            </FormControl>

            </Box>

            <div className="flex justify-center items-center mt-4">
                <label className="block w-60 font-medium text-gray-700">
                Select The Letter of Intent :
                </label>
                <input
                type="file"
                // required
                {...disabled}
                accept=".pdf"
                className="form-input mt-1 ml-0.5"
                onChange={handleFileChange}
                // Add any necessary attributes for file upload
                />
            </div>

            <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'center',alignItems:'center',width:'100%'}}>
              <Button type="submit" variant="contained" sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                {loading? "Loading " : "Save PGPR Application"}
                {loading && <CircularProgress style={{color:"white",margin:"0 0.5rem"}} size={24} />}
              </Button>
            </Box>

        </form>

        <Snackbar
          open={errorMsg == "" ? false : true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setErrorMsg("")}
        >
          <Alert onClose={() => setErrorMsg("")} severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={1500}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            Saved Successfully!
          </Alert>
        </Snackbar>

    </>

  )
}

export default EditPGPRApplication