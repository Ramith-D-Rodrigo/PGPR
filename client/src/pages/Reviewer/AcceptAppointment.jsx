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
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

function AcceptAppointment() {
    const {auth, setAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [accepted, setAccepted] = useState(false);

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
        //navigate to login
    }

    const handleDownloadLetter = async() => {
        //download letter
    }

    const handleSubmitAppointmentLetter = async() => {
        //call api
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
                                            <Button style={{margin:"0 0 15px"}} onClick={handleDownloadLetter} type='submit' color='primary' variant="contained" fullWidth
                                            >
                                                Download Appoinment Letter
                                            </Button>
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
                                            autoHideDuration={2000}
                                            onClose={() => setSuccess(false)}
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                                        >
                                            <Alert onClose={() => setSuccess(false)} severity="success">
                                                Password changed successfully!
                                            </Alert>
                                        </Snackbar> */}
                                </Box>
                                <Box sx={{display:"flex",alignItems:"center",justifyContent:'space-between'}}>

                                    <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                        onClick={()=>setAccepted(true)}
                                        >
                                            Accept the Appointment
                                    </Button>
                                    <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                        onClick={handleRejectAppointment}
                                        >
                                            Reject the Appointment
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
                                        />
                                                
                                    </Box>
                                    <Box sx={{display:"flex",alignItems:"center",justifyContent:'space-between'}}>

                                        <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
                                            onClick={handleSubmitAppointmentLetter}
                                            >
                                                Submit
                                        </Button>
                                        <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"
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
            <Box sx={{position:'absolute',margin:'0 20px',right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"

                    onClick={handleLogOut}
                    >
                        Log Out
                </Button>
            </Box>
        </>
  )
}

export default AcceptAppointment