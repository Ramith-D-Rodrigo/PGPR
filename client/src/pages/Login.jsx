import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  styled,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Container,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import axios from "../api/api";
import AuthContext from "../contexts/AuthProvider";

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);

  //user data states
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [role, setRole] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  // navigations
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/" + role; // where the use got here

  if (!from.startsWith("/" + role)) {
    from = "/" + role;
  }

  // when loading set the messages to empty strings
  useEffect(() => {
    setErrorMsg("");
  }, [email, password, role]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
        }
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
        let { message, errors } =
          error.response?.data || "An unknown error occurred";
        console.log(errors);
        if (message == "auth.fail") message = "Invalid Credentials"; //"These credentials do not match our records."
        setErrorMsg(message);
      }
    }
  }

  useEffect(() => {
    document.title = "Login | QAF for Postgraduate Programs";
    //redirect if logged in (auth object is not null)
    let from =
      location.state?.from?.pathname || auth?.authRole[0]
        ? "/" + auth?.authRole[0]
        : "/login";
    auth && navigate(from, { replace: false });
  }, []);

  useEffect(() => {
    if (success) {
      // Redirect to login page after displaying the success message
      setTimeout(() => {
        auth?.initialLogin
          ? navigate("/initial-password-reset", { replace: true })
          : navigate(from, { replace: true });
      }, 1000);
    }
  }, [success]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const ColorButton = styled(Button)(({ theme }) => ({
    // width: "300px",
    margin: "0 0 15px",
    borderRadius: "10px",
    backgroundColor: "#0E3B81",
    color: theme.palette.getContrastText("#0E3B81"),
    "&:hover": {
      backgroundColor: "#104496",
      // color: "#0b2349",
    },
  }));

  const paperStyle = {
    backgroundColor: "rgb(197 218 251)",
    padding: "3rem 2rem",
    // height: "85vh",
    width: "35rem",
    margin: "auto",
    borderRadius: "20px",
  };

  const allUserTypes = [
    {name:"Reviewer",value:"reviewer"},
    {name:"CQA Officer",value:"cqa_officer"},
    {name:"Programme Coordinator",value:"programme_coordinator"},
    {name:"IQAU Director",value:"iqau_director"},
    {name:"CQA Director",value:"cqa_director"},
    {name:"QAC Director",value:"qac_director"},
    {name:"QAC Officer",value:"qac_officer"},
    {name:"Dean/Director",value:"dean"},
    {name:"Vice Chancellor",value:"vice_chancellor"},
  ];

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          height: "auto",
          justifyContent: "center",
          borderRadius: "20px",
          padding: "5px",
          boxShadow: "0px 0px 10px 5px #4c7cca",
        }}
      >
        <Box justifyContent={"center"} alignItems={"center"}>
          <Typography
            style={{ color: "black",fontFamily: "times new roman, serif",margin:"0 20px"}}
            variant="h4"
            gutterBottom
            fontWeight={"semibold"}
            textAlign={"center"}
          >
            Quality Assurance Framework for <br /> <span style={{color:"darkblue"}}>Postgraduate</span>{" "}
            Programs
          </Typography>
          <img
            style={{ height: "auto", width: "70%", margin: "auto" }}
            src={
              "https://www.amaris.com/wp-content/uploads/2020/08/Quality-Assurance-Quality-Control.png"
            }
            alt="temporary"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height:'auto',
          }}
        >
          <Paper elevation={4} style={paperStyle}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {/* <Avatar style={avatarStyles}><LockIcon fontSize={"large"}/></Avatar> */}
              <Typography style={{ margin: "20px 0",color:"#0E3B81" }} variant="h3">
                SIGN IN
              </Typography>

              <form onSubmit={handleLogin}>
                <FormControl
                  style={{ margin: "15px 0" }}
                  variant="standard"
                  fullWidth
                  required
                >
                  {/* <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel> */}
                  <Input
                    style={{ margin: "15px 0" }}
                    id="input-email"
                    startAdornment={
                      <InputAdornment
                        style={{ margin: "15px 10px 20px 0px" }}
                        position="start"
                      >
                        <MailOutlineIcon style={{color:" #404040"}} fontSize="large" />
                      </InputAdornment>
                    }
                    autoFocus
                    autoComplete="off"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl
                  style={{ margin: "15px 0" }}
                  variant="standard"
                  fullWidth
                  required
                >
                  {/* <InputLabel htmlFor="input-with-icon-adornment">Password</InputLabel> */}
                  <Input
                    style={{ margin: "15px 0" }}
                    id="input-password"
                    startAdornment={
                      <InputAdornment
                        style={{ margin: "15px 10px 20px 0px" }}
                        position="start"
                      >
                        <LockOutlinedIcon style={{color:" #404040"}} fontSize="large" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon style={{color:" #404040"}} />
                          ) : (
                            <VisibilityOutlinedIcon style={{color:" #404040"}} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    fontSize="large"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <FormControl
                  style={{ margin: "15px 0"}}
                  variant="standard"
                  fullWidth
                  required
                >
                  {/* <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel> */}
                  <InputLabel style={{color:" #404040"}} id="demo-simple-select-standard-label">
                    Role
                  </InputLabel>
                  <Select
                    style={{ margin: "15px 0", textAlign: "left" }}
                    startAdornment={
                      <InputAdornment
                        style={{ margin: "15px 10px 20px 0px" }}
                        position="start"
                      >
                        <PersonOutlineIcon style={{color:" #404040"}} fontSize="large" />
                      </InputAdornment>
                    }
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={role}
                    onChange={handleChange}
                    label="Role"
                  >
                    {allUserTypes.map((userType, index) => (
                      <MenuItem value={userType.value} key={index}>
                        {userType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormGroup style={{ margin: "20px 0 0" }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked value={rememberMe} />}
                    label="Remember me"
                  />
                </FormGroup>
                {/* show errors */}
                <ColorButton type="submit" variant="contained" fullWidth>
                  {loading ? "Signing In" : "Sign In"}
                  {loading ? (
                    <CircularProgress
                      style={{ margin: "0 0 0 20px", color: "white" }}
                      thickness={5}
                      size={24}
                    />
                  ) : (
                    ""
                  )}
                </ColorButton>
              </form>
              <Typography style={{ marginTop: "15px" }}>
                <Link href="#">Forgot password ?</Link>
              </Typography>
              <Snackbar
                open={errorMsg == "" ? false : true}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert onClose={() => setSuccess(false)} severity="success">
                  Login Successfull!
                </Alert>
              </Snackbar>
            </Box>
          </Paper>
        </Box>
        
      </div>
    </Container>
  );
};

export default Login;
