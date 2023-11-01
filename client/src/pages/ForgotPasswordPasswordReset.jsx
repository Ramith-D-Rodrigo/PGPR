import axios from "../api/api.js";
import React, {useState, useEffect, useContext} from "react";
import { useLocation, useNavigate} from "react-router-dom";
import {
    Grid,
    Paper,
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    InputAdornment, IconButton,
} from '@mui/material';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import AuthContext from "../contexts/AuthProvider.jsx";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import LockIcon from "@mui/icons-material/Lock";

const ForgotPasswordPasswordReset = () => {
    const { auth } = useContext(AuthContext);

    // this should go to the LoginContext.js
    const [officialEmail, setOfficialEmail] = useState("");
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [disableButton, setDisableButton] = useState({disabled:true});

    // navigations
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
       if (auth) {
           let from =
               location.state?.from?.pathname || auth?.authRole[0]
                   ? "/" + auth?.authRole[0]
                   : "";
           auth && navigate(from, { replace: false });
       } else {
          // Assuming you are using react-router
          const params = new URLSearchParams(window.location.search);
          setOfficialEmail(params.get('officialEmail'));
          setToken(params.get('token'));
       }
    }, []);

    async function handleResetPassword(event) {
        event.preventDefault();
        try {
            setErrorMsg("");
            setLoading(true);
            console.log(officialEmail);
            console.log(password);
            console.log(confirmPassword);
            console.log(token);
            const formData = {
                officialEmail,
                password,
                token,
                confirmedPassword: confirmPassword
            };
            let response = await axios.post('/reset-password', formData);
            console.log(response?.data);
            setSuccess(true);
            navigate('/login', { replace: false });
        } catch (error) {
            setErrorMsg(error?.response?.data?.message);
            console.error(error);
            navigate('/forgot-password', { replace: false });
       } finally {
            setLoading(false);
            setPassword("");
            setConfirmPassword("");
        }
    }

    const paperStyle = {padding:70,height:'80%',width:'50%',margin:"30px auto",borderRadius:"20px"}

    return (
        <>
            {
                 loading ?
                     <Box
                         sx={{
                             display: "flex",
                             flexDirection: "column",
                             alignItems: "center",
                             justifyContent: "center",
                             height: "100vh",
                             marginTop: "-10vh",
                         }}
                     >
                         <Typography variant="h5" color="primary">
                             Please wait until we reset your password...
                         </Typography>
                         <CircularProgress size={50} thickness={3} />
                     </Box>
                     :
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
                                        <Typography style={{margin:"20px 0"}} variant="h4">You can reset your password by providing a new password.</Typography>

                                        <form onSubmit={handleResetPassword}>

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
                                            <Box display="flex">
                                                <Typography style={{margin:"20px 0"}} color="error" variant="body2">*</Typography>
                                                <Typography style={{margin:"20px 0"}} variant="body1">
                                                    Your password must have at least 8 characters and should be less than 50 characters
                                                </Typography>
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
                                                Password changed successfully! You can now login to the platform using the login page.
                                                Thank you.
                                            </Alert>
                                        </Snackbar>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                </Grid>
            </Box>
            }
        </>
    );
}
export default ForgotPasswordPasswordReset;
