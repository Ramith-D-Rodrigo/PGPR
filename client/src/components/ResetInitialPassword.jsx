import axios from "../api/api.js";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useRefreshLogin from "../hooks/useRefreshLogin.js";

//
import { Grid, Paper,Avatar, Box, Typography, Button, CircularProgress, Snackbar,Alert } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

const InitialPasswordRest = () => {

    const { auth } = useContext(AuthContext);
    const refresh = useRefreshLogin();

    // this should go to the LoginContext.js
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [disableButton, setDisableButton] = useState({disabled:true});

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // navigations
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; // where the use got here

    // console.log(auth);

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
        setShowConfirmPassword(false);
    }
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword((show) => !show);
        setShowPassword(false);
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            //disable the submit button
            setDisableButton({ disabled: true });
        }
        else{
            setDisableButton({ disabled: false });
        }
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
        if (confirmPassword !== e.target.value) {
            //disable the submit button
            setDisableButton({ disabled: true });
        }
        else{
            setDisableButton({ disabled: false });
        }
    }

    async function handlePasswordReset(event) {
        event.preventDefault();
        setLoading(true);
        try {
            // get the CSRF-cookie
            await axios.get("/sanctum/csrf-cookie");
            await axios.post(
                "/initial-password-reset",
                // payload
                {
                    officialEmail: auth?.officialEmail,
                    password,
                    passwordConfirmation:confirmPassword,
                },
            );
            await refresh();

            setLoading(false);
           setSuccess(true); 
           setPassword("");
           setConfirmPassword("");

        } catch (error) {
            setLoading(false);
            console.error(error?.response);
            if (!error?.response) {
                setErrorMsg("No Server Response");
            } else {
                console.log(error.response);
                let { message, errors } =  error.response?.data || "An unknown error occurred";
                console.log(errors);
                setErrorMsg(message);
            }
        }
        
    }

    useEffect(() => {
        let from = location.state?.from?.pathname || auth?.authRole[0]? "/"+auth.authRole[0]+"/dashboard" : "/login";
        auth?.officialEmail && navigate(from, { replace: false });
    }, []);

    useEffect(() => {
        if (success) {
          // Redirect to login page after displaying the success message
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 2000);
        }
    }, [success]);

    // when loading set the messages to empty strings
    useEffect(() => {
        setErrorMsg("");
    }, [password, confirmPassword]);

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
                        
                            <Paper elevation={10} style = {paperStyle}>
                                <Box sx={{display:"flex",alignItems:"center",height:"100%",justifyContent:"center"}}>
                                    <Grid align="center">
                                        {/* <Avatar style={avatarStyles}><LockIcon fontSize={"large"}/></Avatar> */}
                                        <Typography style={{margin:"20px 0"}} variant="h4">Change Password</Typography>
                                        <Typography style={{margin:"20px 0"}} variant="body">You have to change your password at your first login</Typography>                                     
                                        
                                        <form onSubmit={handlePasswordReset}>

                                            <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                                                required
                                                >
                                                {/* <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel> */}
                                                <Input style={{margin:"15px 0"}}
                                                id="input-password"
                                                startAdornment={
                                                    <InputAdornment style={{margin:"15px 10px 20px 0px"}} position="start">
                                                    <LockIcon fontSize='large' />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    </InputAdornment>
                                                }
                                                autoFocus
                                                placeholder='Password'
                                                type={showPassword ? 'text' : 'password'}
                                                fontSize='large'
                                                value={password}
                                                onChange={(e)=>handlePassword(e)}
                                                />
                                            </FormControl>

                                            <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                                                required>
                                                {/* <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel> */}
                                                <Input style={{margin:"15px 0"}}
                                                id="input-confirm-password"
                                                startAdornment={
                                                    <InputAdornment style={{margin:"15px 10px 20px 0px"}} position="start">
                                                    <LockIcon fontSize='large' />
                                                    </InputAdornment>
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowConfirmPassword}
                                                        onMouseDown={handleMouseDownConfirmPassword}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    </InputAdornment>
                                                }
                                                placeholder='Confirm Password'
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                fontSize='large'
                                                value={confirmPassword}
                                                onChange={(e)=>{handleConfirmPassword(e)}}
                                                />
                                            </FormControl>

                                        
                                            {/* show errors */}
                                            {/* <p style={{color:'red'}} ref={errorRef}>{errorMsg}</p> */}
                                            <Button style={{margin:"0 0 15px"}} {...disableButton} type='submit' color='primary' variant="contained" fullWidth
                                            >
                                                {loading ? <CircularProgress size={24} /> : 'Change Password'}
                                            </Button>
                                        </form>
                                        {/* success message */}
                                        <Snackbar
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
                                        </Snackbar>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default InitialPasswordRest;
