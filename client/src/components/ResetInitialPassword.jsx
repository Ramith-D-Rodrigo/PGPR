import axios from "../api/api.js";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useRefreshLogin from "../hooks/useRefreshLogin.js";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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

    const { auth,setAuth } = useContext(AuthContext);
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
        //todo: validation s.a. strong password should be check
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
        //validations
        /*
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters");
            return;
        }
        if (!password.match(/[a-z]/)) {
            setErrorMsg("Password must contain at least one lowercase character");
            return;
        }
        if (!password.match(/[A-Z]/)) {
            setErrorMsg("Password must contain at least one uppercase character");
            return;
        }
        if (!password.match(/[0-9]/)) {
            setErrorMsg("Password must contain at least one number");
            return;
        }
        if (!specialCharacters.some((char) => password.includes(char))) {
            setErrorMsg("Password must contain at least one special character");
            return;
        }
        */
        
        try {
            setLoading(true);
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

    const specialCharacters = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", ";", ":", "'", '"', ",", "<", ".", ">", "/", "?", "|", "\\", "`", "~"];

    useEffect(() => {
        console.log("auth : ",auth);
        let from = location.state?.from?.pathname || auth?.authRole[0]? "/"+auth?.authRole[0] : "/login";
        !auth?.initialLogin && navigate(from, { replace: false });
    }, []);

    const logout = async () => {
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

    const handleLogOut = () => {
        logout();
    }

    useEffect(() => {
        if (success) {
          // Redirect to login page after displaying the success message
          // Note: backend will log out the user after the password reset

          
            if(auth?.authRole[0] == "reviewer")
            {
                navigate("/accept-appointment");
            }
            else{
                logout();
            }
        }
    }, [success]);

    // when loading set the messages to empty strings
    useEffect(() => {
        setErrorMsg("");
    }, [password, confirmPassword]);

    const logoutDisable = loading? {disabled:true} : {disabled:false};
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
                                                {loading ? <CircularProgress thickness={6} color='secondary' size={24} /> : 'Change Password'}
                                            </Button>
                                            <Typography align="left" style={{color:"black",fontSize:"1rem"}} variant="h6">Your password must have : </Typography>
                                            <Box sx={{margin:"1rem 0",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"45%",margin:"0.3rem 0"}}>
                                                    <Typography variant="body">one lowercase character</Typography>
                                                    {password.match(/[a-z]/) ? <CheckCircleIcon sx={{color:"green"}}/> : <CheckCircleOutlineIcon sx={{color:"lightgreen"}}/>}
                                                </div>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"45%",margin:"0.3rem 0"}}>
                                                    <Typography variant="body">one uppercase character</Typography>
                                                    {password.match(/[A-Z]/) ? <CheckCircleIcon sx={{color:"green"}}/> : <CheckCircleOutlineIcon sx={{color:"lightgreen"}}/>}
                                                </div>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"45%",margin:"0.3rem 0"}}>
                                                    <Typography variant="body">one special character</Typography>
                                                    {specialCharacters.some((char) => password.includes(char)) ? <CheckCircleIcon sx={{color:"green"}}/> : <CheckCircleOutlineIcon sx={{color:"lightgreen"}}/>}
                                                </div>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"45%",margin:"0.3rem 0"}}>
                                                    <Typography variant="body">one number</Typography>
                                                    {password.match(/[0-9]/) ? <CheckCircleIcon sx={{color:"green"}}/> : <CheckCircleOutlineIcon sx={{color:"lightgreen"}}/>}
                                                </div>
                                                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"45%",margin:"0.3rem 0"}}>
                                                    <Typography variant="body">at least 8 characters</Typography>
                                                    {password.length >= 8 ? <CheckCircleIcon sx={{color:"green"}}/> : <CheckCircleOutlineIcon sx={{color:"lightgreen"}}/>}
                                                </div>                                                
                                            </Box>
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

            <Box sx={{position:'absolute',margin:'0 20px',right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Button {...logoutDisable} style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained"

                    onClick={handleLogOut}
                    >
                        Log Out
                </Button>
            </Box>
        </>
    );
}

export default InitialPasswordRest;
