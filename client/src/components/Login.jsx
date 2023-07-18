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

const Login = () => {

  const [showPassword, setShowPassword] = React.useState(false);
  const [email,setEmail] = React.useState('');
  const [password,setPassword] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //send data to backend using fetch api
    const data = {email,password};
    console.log(data);

    //use fetch API
    fetch('http://localhost:8000/login',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data)
    }).then((res)=>{
      if(res.status === 200){
        console.log("Login Successful");
        window.location.href = "/dashboard";
      }
      else{
        console.log("Login Failed");
      }
    }
    ).catch((err)=>{
      console.log(err);
    }
    )
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

                        <form onSubmit={handleSubmit}>
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
