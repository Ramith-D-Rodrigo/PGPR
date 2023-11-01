import axios from "../api/api.js";
import {useState, useEffect, useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Grid, Paper, Box, Typography, Button, Snackbar, Alert, InputLabel, CircularProgress} from '@mui/material';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import AuthContext from "../contexts/AuthProvider.jsx";

const ForgotPasswordEmailVerification = () => {

    const { auth } = useContext(AuthContext);

    // this should go to the LoginContext.js
    const [officialEmail, setOfficialEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // navigations
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
       if (auth) {
           let from =
               location.state?.from?.pathname || auth?.authRole[0]
                   ? "/" + auth?.authRole[0]
                   : "";
           auth && navigate(from, { replace: false });
       }
    }, []);

    async function handleEmailVerification(event) {
        event.preventDefault();
        try {
            setErrorMsg("");
            setLoading(true);
            console.log(officialEmail);
            const formData = {
                officialEmail
            };
            let response = await axios.post('/forgot-password', formData);
            console.log(response?.data);
            setOfficialEmail("");
            setSuccess(true);
        } catch (error) {
            setErrorMsg(error?.response?.data?.message);
            console.error(error);
       } finally {
            setLoading(false);
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
                             Sending the verification email...
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
                                         <Typography style={{margin:"20px 0"}} variant="h4">Email Verification</Typography>
                                         <Typography style={{margin:"20px 0"}} variant="body">We have to confirm it is actually you in order to reset your password.</Typography>

                                         <form onSubmit={handleEmailVerification}>

                                             <FormControl style={{margin:"15px 0"}} variant="standard" fullWidth
                                                          required
                                             >
                                                 {/* <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel> */}
                                                 <InputLabel htmlFor='official-email'>Official Email</InputLabel>
                                                 <Input style={{margin:"15px 0"}}
                                                        id="official-email"
                                                        autoFocus
                                                        placeholder='Official Email'
                                                        type='email'
                                                        fontSize='medium'
                                                        value={officialEmail}
                                                        onChange={(e)=> setOfficialEmail(e.target.value)}
                                                 />
                                             </FormControl>

                                             {/* show errors */}
                                             {/* <p style={{color:'red'}} ref={errorRef}>{errorMsg}</p> */}
                                             <Button style={{margin:"0 0 15px"}} type='submit' color='primary' variant="contained" fullWidth>
                                                 Verify My Eamil
                                             </Button>
                                         </form>
                                         {/* success message */}
                                         <Snackbar
                                             open={errorMsg !== ""}
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
                                                 Email Verification link has been sent to your email, please click the link on the email you received to proceed.
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

export default ForgotPasswordEmailVerification;