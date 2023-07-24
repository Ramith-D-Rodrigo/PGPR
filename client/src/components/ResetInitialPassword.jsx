import axios from "../api/api.js";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import useRefreshLogin from "../hooks/useRefreshLogin.js";

//
import { Grid, Paper,Avatar, Box, Typography, Button } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

const InitialPasswordRest = () => {

    const userInputRef = useRef(); // used to set the focus on inputs
    const errorRef = useRef(); // in case of input error set the focus on them
    const { auth } = useContext(AuthContext);
    const refresh = useRefreshLogin();

    // this should go to the LoginContext.js
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // navigations
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; // where the use got here

    console.log(auth);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    async function handlePasswordReset(event) {
        event.preventDefault();
        try {
            // get the CSRF-cookie
            await axios.get("/sanctum/csrf-cookie");
            await axios.post(
                "/initial-password-reset",
                // payload
                {
                    officialEmail: auth?.officialEmail,
                    password,
                    pDasswordConfirmation:confirmPassword,
                },
            );
            await refresh();

           setPassword("");
           setConfirmPassword("");
           alert("Password Successfully Changed");
           navigate(from, { replace: true }); // navigate to the intended page
        } catch (error) {
            console.error(error?.response);
            if (!error?.response) {
                setErrorMsg("No Server Response");
            } else {
                console.log(error.response);
                let { message, errors } =  error.response?.data || "An unknown error occurred";
                console.log(errors);
                setErrorMsg(message);
            }
            errorRef.current.focus();
        }
    }

    useEffect(() => {
        userInputRef.current.focus();
    }, []);

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
                                                required>
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
                                                placeholder='Password'
                                                type={showPassword ? 'text' : 'password'}
                                                fontSize='large'
                                                value={password}
                                                onChange={(e)=>setPassword(e.target.value)}
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
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    </InputAdornment>
                                                }
                                                placeholder='Confirm Password'
                                                type={showPassword ? 'text' : 'password'}
                                                fontSize='large'
                                                value={confirmPassword}
                                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                                />
                                            </FormControl>

                                        
                                            {/* show errors */}
                                            <p style={{color:'red'}} ref={errorRef}>{errorMsg}</p>
                                            <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained" fullWidth
                                            >
                                                Change
                                            </Button>
                                        </form>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                </Grid>
            </Box>
        
                <section>
                    <p ref={errorRef}>{errorMsg}</p>
                    <h1>Reset Password</h1>
                    <p>This is your first login please change your password to proceed.</p>
                    <form onSubmit={handlePasswordReset}>
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            name="reset-passowrd"
                            ref={userInputRef}
                            autoComplete="off"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            value={password}
                            required
                        ></input>
                        <label htmlFor="password-confirmation">Confirm the password: </label>
                        <input
                            type="password"
                            id="password-confirmation"
                            name="reset-password-confirmation"
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                            value={confirmPassword}
                            required
                        ></input>
                        <button>Change Password</button>
                    </form>
                </section>
        </>
    );
}

export default InitialPasswordRest;
