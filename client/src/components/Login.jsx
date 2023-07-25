
import { Grid, Paper, Box, Typography, Button, CircularProgress, Snackbar,Alert} from '@mui/material'
import { styled } from '@mui/material/styles';
import LockIcon from '@mui/icons-material/Lock';
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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
//
import { useState, useEffect, useContext } from "react";

import axios from "../api/api.js";
import AuthContext from "../contexts/AuthProvider.jsx";
import {useNavigate, useLocation} from "react-router-dom";

const Login = () => {
  
  const { auth,setAuth } = useContext(AuthContext);
  console.log(auth);  // "error: auth object is undefined"

  //user data states
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState("");

  const [role, setRole] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  
  // navigations
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/"+role; // where the use got here

  if(!from.startsWith("/"+role))
  {
    from = "/"+role;
  }

  // when loading set the messages to empty strings
  useEffect(() => {
    setErrorMsg("");
  }, [email, password, role]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }
  
  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      // get the CSRF-cookie
      await axios.get("/sanctum/csrf-cookie");
      let response = await axios.post(
        "/login",
        // payload
        {
          officialEmail: email,
          password,
          loginAs: role,
        },
      );
      // don't wrap the return value in the backend with the Response()
      // the returned data won't be in this format
      setAuth(response?.data || null);
      setLoading(false);
      setSuccess(true);
      setEmail("");
      setPassword("");
      // setRole("");
      
    } catch (error) {
      setLoading(false);
      console.error(error?.response);
      if (!error?.response) {
        // check if the request went through to the server
        setErrorMsg("Server Not Responded. Check your Connection");
      } else {
        // read the errors
        console.log(error.response);
        let { message, errors } =  error.response?.data || "An unknown error occurred";
        console.log(errors);
        setErrorMsg(message);
        }
    }
  }

  useEffect(() => {
    //redirect if logged in (auth object is not null)
    let from = location.state?.from?.pathname || auth?.authRole[0]? "/"+auth.authRole[0]+"/dashboard" : "/login";
    auth && navigate(from, { replace: false });
    // console.log(auth);
    // console.log(from);
    // console.log("here");
}, []);

useEffect(() => {
  if (success) {
    // Redirect to login page after displaying the success message
    setTimeout(() => {
      auth?.initialLogin ? navigate('/initial-password-reset', { replace: true }) : navigate(from, { replace: true });
    }, 1000);
  }
}, [success]);
    
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

    const paperStyle = {padding:20,height:'70vh',width:'80%',margin:"30px auto",borderRadius:"20px"}

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
                              autoFocus
                              autoComplete="off"
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

                          <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                              required>
                            {/* <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel> */}
                            <InputLabel id="demo-simple-select-standard-label">Role</InputLabel>
                            <Select
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={role}
                              onChange={handleChange}
                              label="Role"
                            >
                              <MenuItem value={"reviewer"}>Reviewer</MenuItem>
                              <MenuItem value={"coordinator"}>Program Coordinator</MenuItem>
                              <MenuItem value={"iqauofficer"}>IQAU Officer</MenuItem>
                              <MenuItem value={"cqadirector"}>CQA Director</MenuItem>
                              <MenuItem value={"qacdirector"}>QAC Director</MenuItem>
                              <MenuItem value={"qacofficer"}>QAC Officer</MenuItem>
                              <MenuItem value={"dean"}>Director/Dean</MenuItem>
                              <MenuItem value={"vicechancellor"}>Vice Chancellor</MenuItem>
                            </Select>

                          </FormControl>
                          <FormGroup style={{margin:"20px 0 0"}}>
                            <FormControlLabel control={<Checkbox defaultChecked value={rememberMe}/>} label="Remember me" />
                          </FormGroup>
                          {/* show errors */}
                          <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained" fullWidth
                          >
                            {loading ? <CircularProgress thickness={6} color='secondary' size={24} /> : 'Sign In'}
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

                        <Snackbar
                            open={errorMsg =="" ? false : true}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                            onClose={() => setErrorMsg("")}
                        >
                            <Alert onClose={() => setErrorMsg("")} severity="error">
                                {errorMsg}
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={success}
                            autoHideDuration={1000}
                            onClose={() => setSuccess(false)}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Alert onClose={() => setSuccess(false)} severity="success">
                                Login Successfull!
                            </Alert>
                        </Snackbar>
                    </Grid>
                  </Box>
                </Paper>
            </Grid>
      </Grid>
    </Box>
  )
}

export default Login
