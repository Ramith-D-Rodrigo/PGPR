import { TextField, Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select,Snackbar,Alert, Box, Typography } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText';
import axios from '../../api/api.js';
import { useState, useEffect, useRef } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useNavigate } from 'react-router-dom';
import getDeanFaculty from '../../api/Dean/getDeanFaculty';
import getFacultyPostGraduatePrograms from '../../api/Faculty/getFacultyPostGraduatePrograms';
import createPGPRApplication from '../../api/PostGraduateProgramApplication/createPGPRApplication';
import useAuth from '../../hooks/useAuth';

const PGPRApplication = () => {
  const { auth } = useAuth();

  useSetUserNavigations(
    [
        {
          name: "PGPR Applications",
          link: "/PGPRApplications"
        },
        {
          name: "Create PGPR Application",
          link: "/PGPRApplications/create"
        },
      
    ]
  );
    
    const navigate = useNavigate();
    const [pgps, setPGPs] = useState([]); //state variable to store the response data
    const [selectedSLQFLevel, setSelectedSLQFLevel] = useState("");
    const [year1, setYear1] = useState("");
    const [year2, setYear2] = useState("");
    const [year3, setYear3] = useState("");
    const [year4, setYear4] = useState("");
    const [year5, setYear5] = useState("");
    const [yearEnd, setYearEnd] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [PGPSelected,setSelectedPGP] = useState({});

    // let selectedPGP = useRef("");
    // let selectedSLQFLevel = useRef("");

    document.title = "View PGPR Application";

    useEffect(() => {
        const handleGetPGPs = async () => {
          setLoading(true);
          setErrorMsg(false);
          setSuccess(false);
    
          try{
            //first get the faculty of the dean 
            const facultyResult = await getDeanFaculty(auth.id);

            const facultyId = facultyResult.data.data.id;
              
            //then get the postgraduate programmes of that faculty
            const pgpResult = await getFacultyPostGraduatePrograms(facultyId);
            
            setPGPs(pgpResult.data.data);
            console.log("data : ",pgpResult.data.data); //data is an array of objects
    
            //set the default selc=ected pgp & SLQF level to 0th index of the array
            // selectedPGP.current = res.data.data[0];
            setSelectedPGP(pgpResult.data.data[0]);
            setSelectedSLQFLevel(pgpResult.data.data[0]?.slqfLevel);
          }
          catch(err){
            console.log(err);
            setErrorMsg(err?.response?.data?.message);
          }
          setLoading(false);
        }

        handleGetPGPs();
    }, []);

    useEffect(()=>{
      setErrorMsg("");
    },[year1,year2,year3,year4,year5,yearEnd])


    const displaySLQFLevelForPGP = (event) => {
      console.log(event.target.value);
      const pgp =  pgps.find((pgp) => pgp.id === parseInt(event.target.value));
      setSelectedPGP(pgp);
      setSelectedSLQFLevel(pgp.slqfLevel);
    }

    const isProfessionalPgProgramme = PGPSelected.isProfessionalPgProgramme == 1 ? true : false;

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

      const data = {
        year_1: year1,
        year_2: year2,
        year_3: year3,
        year_4: year4,
        year_5: year5,
        yEnd: yearEnd,
        postGraduateProgramId: PGPSelected.id,
      }
      console.log("data : ",data);
      
      //create the application      
      try{
        await axios.get("/sanctum/csrf-cookie");
        const creationResult = await createPGPRApplication(data);
        setLoading(false);
        if(creationResult.status == 201)
        {
          console.log("created");
          setSuccess(true);
          setTimeout(()=>{
            navigate('../');
          },1500)
        }
        
      }
      catch(err) {
        console.log("err : ",err);
        console.log(err?.response?.data?.message);
        setLoading(false);
        setErrorMsg(err?.response?.data?.message);
      };
    }


  return (
    <>

        {/* <Typography align='center' margin={2}  variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Request for Postgraduate Programme Review
        </Typography> */}
        <Typography align='center' margin="1rem 0 2rem" fontWeight={600} variant="h5" gutterBottom component="div" style={{marginRight:'20px'}}>
          Request for Postgraduate Programme Review
        </Typography>
        <form onSubmit={handleSubmitApplication} style={{display:"flex",flexDirection:"column",flexWrap:'wrap',width:'100%',justifyContent:'center',alignItems:'center'}}>
            <FormControl sx={{ m: 1, width:"50%" ,minWidth: 120 }}>
              <InputLabel id="pg_programme">Postgraduate Programme</InputLabel>
              <Select
                labelId="PG_programme_label"
                id="PG_programme"
                value={PGPSelected?.id || ""}
                label="Postgraduate Programme"
                required
                onChange={displaySLQFLevelForPGP}
              >
                {pgps.map((pgp) => (
                  <MenuItem key={pgp.id} value={pgp.id}>{pgp.title}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the Postgraduate Programme</FormHelperText>
            </FormControl>

          <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'center',alignItems:'center',width:'100%',margin:"2rem 0 0"}}>
            <FormGroup sx={{width:"40%"}}>
              <InputLabel id="year1-label">Professional Postgraduate Programme</InputLabel>
              <FormControlLabel label="yes" disabled control={<Checkbox checked={isProfessionalPgProgramme} />} />
            </FormGroup>

            <TextField
              sx={{width:"40%"}}
              id="standard-disabled"
              label="SLQF Level"
              value={selectedSLQFLevel}
              variant="standard"
            />
          </Box>

            <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'flex-start',alignItems:'center',width:'100%'}}>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year1-label">Year 1</InputLabel>
                <Input id="year1" type='number' value={year1} onChange={(e) => setYear1(e.target.value)} required/>
                <FormHelperText>Select the Year 1</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year2-label">Year 2</InputLabel>
                <Input id="year2" type='number' value={year2} onChange={(e) => setYear2(e.target.value)} required/>
                <FormHelperText>Select the Year 2</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year3-label">Year 3</InputLabel>
                <Input id="year3" type='number' value={year3} onChange={(e) => setYear3(e.target.value)} required/>
                <FormHelperText>Select the Year 3</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year4-label">Year 4</InputLabel>
                <Input id="year4" type='number' value={year4} onChange={(e) => setYear4(e.target.value)} required/>
                <FormHelperText>Select the Year 4</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <InputLabel id="year5-label">Year 5</InputLabel>
                <Input id="year5" type='number' value={year5} onChange={(e) => setYear5(e.target.value)} required/>
                <FormHelperText>Select the Year 5</FormHelperText>
              </FormControl>

              <FormControl  sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                <Input id="yearEnd" type='date' value={yearEnd} onChange={(e) => setYearEnd(e.target.value)} required/>
                <FormHelperText>Select the Year End</FormHelperText>
            </FormControl>

            </Box>

            <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'center',alignItems:'center',width:'100%'}}>
              <Button type="submit" variant="contained" sx={{ margin:"2rem 0.5rem", minWidth: 120,width:"30%" }}>
                {loading? "Loading " : "Create PGPR Application"}
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
            Created Successfully!
          </Alert>
        </Snackbar>

    </>

  )
}

export default PGPRApplication