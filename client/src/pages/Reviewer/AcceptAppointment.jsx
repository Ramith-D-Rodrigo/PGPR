import axios from "../../api/api.js";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../../contexts/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useRefreshLogin from "../../hooks/useRefreshLogin.js";
import TextField from '@mui/material/TextField';
import { Grid, Paper,Avatar, Box, Typography, Button, CircularProgress, Snackbar,Alert } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants.js";
import { Link } from "react-router-dom";
import React from 'react';

function AcceptAppointment() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [accepted, setAccepted] = useState(false);
    const [appointmentLetter, setAppointmentLetter] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [Loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const disableBTNs = Loading? {disabled:true} : {disabled:false};

    useEffect(() => {
        document.title = "Reviewer | Accept Appointment";
        const root = document.querySelector('#root');
        root.style.backgroundImage = "linear-gradient(to right, #6194e7, #adcbfc)";

        //TODO: redirect if already accepted
    }, []);

    const handleLogOut = async() => {
        try {
            axios.get("/sanctum/csrf-cookie");
            let response = await axios.post("/logout");
            console.log(response?.status);
            setAuth(null);
            navigate("/login");
        }
        catch (error) {
            if (!error?.response) {
                console.log("No Server Response");
                setAuth(null);
                navigate("/login");
            } else {
                console.log(error?.response);
            }
        }
    }

    const handleRejectAppointment = async() => {
        //call api
        setOpen(false);
        setLoading(true);
        setErrorMsg("");
        try {
            axios.get("/sanctum/csrf-cookie");
            let response = await axios.post(
                SERVER_URL+SERVER_API_VERSION+"reviewers/reject-appointment",
                {
                    reasonForRejecting: "Tempory answer",
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(response?.status);
            if(response?.status == 200) {
                setSuccess(true);
                setTimeout(()=>handleLogOut(), 1500);
            }
            else if(response?.status == 201){
                setSuccess(true);
                setTimeout(()=>handleLogOut(), 1500);
            }
            setAccepted(true);
            setLoading(false);
        }
        catch (error) {
            if (!error?.response) {
                setErrorMsg("No Server Response");
            }
            else if(error?.response?.status == 401) {
                setErrorMsg("You are not authorized to perform this action");
            }
            else {
                console.log(error);
                setErrorMsg(error?.response?.data?.message);
            }
            setLoading(false);
        }
    }

    const handleSubmitAppointmentLetter = async(evt) => {
        evt.preventDefault();
        if(appointmentLetter == null) {
            setErrorMsg("Please upload the appointment letter");
            return;
        }
        const formdata = new FormData();
        formdata.append("file", appointmentLetter);
        //call api
        try {
            setLoading(true);
            axios.get("/sanctum/csrf-cookie");
            let response = await axios.post(
                SERVER_URL+SERVER_API_VERSION+"reviewers/accept-appointment",
                formdata, 
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                } 
            );
            console.log(response?.status);
            if(response?.status == 200) {
                setSuccess(true);
                setTimeout(()=>handleLogOut(), 1500);
            }
            else if(response?.status == 401) {
                setErrorMsg("You are not authorized to perform this action");
                setTimeout(()=>handleLogOut(), 1500);
            }
            else if(response?.status == 201){
                setSuccess(true);
                setTimeout(()=>handleLogOut(), 1500);
            }
            setAccepted(true);
            setLoading(false);
        }
        catch (error) {
            if (!error?.response) {
                setErrorMsg("No Server Response");
            } else {
                console.log(error);
                setErrorMsg(error?.response?.data?.message);
            }
            setLoading(false);   
        }
        //navigate to login
    }

    const paperStyle = {padding:70,height:'70vh',width:'40%',margin:"30px auto",borderRadius:"20px"}

  return (
        <>
            <Box sx={{display:"flex",alignItems:"center",height:"100vh",justifyContent:"center"}}>
                <Grid container spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    >

                        <Grid item xs={12}>
                        
                            {!accepted && <Paper elevation={10} style = {paperStyle}>
                                <Box sx={{display:"flex",flexDirection:'column',alignItems:"center",height:"100%",justifyContent:"space-between"}}>


                                            {/* <Avatar style={avatarStyles}><LockIcon fontSize={"large"}/></Avatar> */}
                                            <Typography style={{margin:"20px 0"}} variant="h4">Accept Appoint as a Reviewer</Typography>
                                            {/* <Typography style={{margin:"20px 0"}} variant="body">You have to change your password at your first login</Typography>                                      */}
                                        
                                        

                                            <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                                                required
                                                >
                                                {/* <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel> */}
                                                <Input style={{margin:"15px 0"}}
                                                id="reviewer-name"
                                                autoFocus
                                                type='text'
                                                readOnly
                                                fontSize='large'
                                                value={`Name : ${auth.fullName}`}
                                                onChange={(e)=>handlePassword(e)}
                                                />
                                            </FormControl>

                                            <Typography style={{margin:"20px 0"}} variant="h6">
                                                It's happy to inform you that you have been appointed as a reviewer for postgraduate programs by QAC. Click below to download the appointment letter.
                                            </Typography>

                                        
                                            {/* show errors */}
                                            {/* <p style={{color:'red'}} ref={errorRef}>{errorMsg}</p> */}
                                            <Link to= {SERVER_URL+SERVER_API_VERSION+"reviewers/download-declaration"}>
                                                <Button {...disableBTNs} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained" fullWidth>
                                                    Download Appoinment Letter
                                                </Button>
                                            </Link>
                                        {/* success message */}
                                        {/* <Snackbar
                                            open={errorMsg =="" ? false : true}
                                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        >
                                            <Alert onClose={() => setErrorMsg("")} severity="error">
                                                {errorMsg}
                                            </Alert>
                                        </Snackbar>
                                        <Snackbar
                                            open={success}
                                            autoHideDuration={1500}
                                            onClose={() => setSuccess(false)}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                        >
                                            <Alert onClose={() => setSuccess(false)} severity="success">
                                                Password changed successfully!
                                            </Alert>
                                        </Snackbar> */}
                                </Box>
                                <Box sx={{display:"flex",alignItems:"center",justifyContent:'space-between'}}>

                                    <Button {...disableBTNs} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                        onClick={()=>setAccepted(true)}
                                        >
                                            Accept the Appointment
                                    </Button>
                                    <Button {...disableBTNs} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                        onClick={()=>setOpen(true)}
                                        >
                                            {Loading ? "Rejecting " : "Reject the Appointment "}
                                            {Loading ? <CircularProgress style={{marginLeft:"0.5rem"}} size={24} /> : ""}
                                    </Button>
                                </Box>
                            </Paper>}

                            {accepted && 
                            <Paper elevation={10} style = {paperStyle}>
                                <form style={{width:"100%",height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-around'}} noValidate autoComplete="off">
                                    <Box sx={{display:"flex",flexDirection:'column',alignItems:"center",height:"100%",justifyContent:"space-between"}}>

                                        <Typography style={{margin:"20px 0"}} variant="h4">Upload the Appointment Letter</Typography>
                                    
                                        <TextField
                                            sx={{margin:"15px 0",width:"100%",height:"100%"}}
                                            id="letter"
                                            type='file'
                                            required
                                            accepted=".pdf"
                                            onChange={(e)=>setAppointmentLetter(e.target.files[0])}
                                        />
                                                
                                    </Box>
                                    <Box sx={{display:"flex",alignItems:"center",justifyContent:'space-between'}}>

                                        <Button {...disableBTNs} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                            onClick={handleSubmitAppointmentLetter}
                                            >
                                                {Loading ? "Submitting " : "Submit "}
                                                {Loading ? <CircularProgress style={{marginLeft:"0.5rem"}} size={24} /> : ""}
                                        </Button>
                                        <Button {...disableBTNs} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                            onClick={()=>setAccepted(false)}
                                            >
                                                cancel
                                        </Button>
                                    </Box>
                                </form>
                            </Paper>}
                        </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={errorMsg == "" ? false : true}
                autoHideDuration={1500}
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

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={()=>setOpen(false)}
                aria-labelledby="submit-appointment"
            >
                <DialogTitle id="submit-appointmentID">
                {"Are you sure that you want to Reject this appointment?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    If you reject this appointment, you will be logged out from the system.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={()=>setOpen(false)}>
                    cancel
                </Button>
                <Button onClick={()=>handleRejectAppointment()} autoFocus>
                    Reject
                </Button>
                </DialogActions>
            </Dialog>
        </>
  )
}

export default AcceptAppointment