import { Grid, Paper,Avatar, Box, Typography, Button } from '@mui/material'
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react'
//
import { useRef, useState, useEffect, useContext } from "react";
import axios from "../api/api.js";
import AuthContext from "../contexts/AuthProvider.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  
  //refs & auth
  const userInputRef = useRef(); // used to set the focus on inputs
  const errorRef = useRef(); // in case of input error set the focus on them
  const { setAuth } = useContext(AuthContext);

  //user data states
  const [showPassword, setShowPassword] = React.useState(false);
  const [email,setEmail] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = useState("");
  
  // navigations
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // where the use got here

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }
  
  async function handleLogin(event) {
    event.preventDefault();
    try {
      // get the CSRF-cookie
      await axios.get("/sanctum/csrf-cookie");
      let response = await axios.post(
        "/login",
        // payload
        {
          official_email: email,
          password,
        },
      );
      // don't wrap the return value in the backend with the Response()
      // the returned data won't be in this format
      setAuth(response?.data || null);
      setEmail("");
      setPassword("");

      // add the user navigation
      navigate(from, { replace: true }); // this login will be pushed to the history
    } catch (error) {
      console.error(error?.response);
      if (!error?.response) {
        // check if the request went through to the server
        setErrorMsg("No Server Response");
      } else {
        // read the errors
        console.log(error.response);
        let { message, errors } =  error.response?.data || "An unknown error occurred";
        console.log(errors);
        setErrorMsg(message);
        }
      errorRef.current.focus();
    }
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

    const paperStyle = {padding:20,height:'70vh',width:'80%',margin:"30px auto",borderRadius:"20px"}

    const avatarStyles = {backgroundColor:'#3f51b5',width:'60px',height:'60px'}
  return (
    <Box sx={{display:"flex",alignItems:"center",height:"100vh",justifyContent:"center"}}>
      <Grid container spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          
            <Grid item xs={7} justifyContent={"center"} alignItems={"center"}>
                <Typography variant="h4" gutterBottom textAlign={"center"}>
                  Quality Assurance Framework for <br/> <span style={{color:"#3f51b5"}}>Postgraduate</span> Programs
                </Typography>
                <img style={{height:'60vh',width:'60%',margin:"auto"}} src={"https://assets-global.website-files.com/5e8b3356a5a8f5321855bbe7/648c7d9b38164fd8fc587f8a_img-person-form.png"} alt="temporary" />
            </Grid>

            <Grid item xs={5}>
              
                <Paper elevation={10} style = {paperStyle}>
                  <Box sx={{display:"flex",alignItems:"center",height:"100%",justifyContent:"center"}}>
                    <Grid align="center">
                        {/* <Avatar style={avatarStyles}><LockIcon fontSize={"large"}/></Avatar> */}
                        <Typography style={{margin:"20px 0"}} variant="h3">Sign In</Typography>
                        
                        {/* show errors */}
                        <p ref={errorRef}>{errorMsg}</p>
                          
                        <form onSubmit={handleLogin}>
                          <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                              required>
                            {/* <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel> */}
                            <Input style={{margin:"15px 0"}}
                              id="input-email"
                              startAdornment={
                                <InputAdornment style={{margin:"15px 10px 20px 0px"}} position="start">
                                  <EmailIcon fontSize='large' />
                                </InputAdornment>
                              }
                              autoComplete="off"
                              ref={userInputRef}
                              type='email'
                              placeholder='Email'
                              value={email}
                              onChange={(e)=>setEmail(e.target.value)}
                            />
                          </FormControl>

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
                          <FormGroup style={{margin:"20px 0 0"}}>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                          </FormGroup>
                          <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained" fullWidth
                          >
                            Sign in
                          </Button>
                        </form>
                        <Typography style={{marginTop:"15px"}}>
                          <Link href="#" >
                            Forgot password ?
                          </Link>
                        </Typography >
                        <Typography> Do you have an account ?
                          <Link href="#" >
                            Sign Up
                          </Link>
                        </Typography>
                    </Grid>
                  </Box>
                </Paper>
            </Grid>
      </Grid>
    </Box>
  )
}

export default Login
