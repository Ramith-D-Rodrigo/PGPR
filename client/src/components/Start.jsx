import React from 'react';
import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "../contexts/AuthProvider.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
//down arrow
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
//up arrow
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { styled } from '@mui/material/styles';
import { Grid, Paper,Avatar, Box, Typography, Button } from '@mui/material'

const Start = ({allowedRoles}) => {

    const { auth } = useAuth();

    const [show,setShow] = useState(false);

    // navigations
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login"

  const handleClick = () => {
    //toggle show
    setShow(!show);
}

    // redirect to login if not logged in
    // if (!auth) {
    //     return <Navigate to="/login" state={{ from: location }} replace />
    // }

    const paperStyle1={padding :20,width:'300px',height:"300px", margin:"50px auto 0",userSelect:"none"}  
    const paperStyle2={padding :"20px 200px",width:'80%',height:"200px", margin:"20px auto 0"}  

  return (
    <>
        <Box sx={{display:"flex",flexDirection:'column',alignItems:"center",justifyContent:"center"}}>
            <Paper style={paperStyle1} elevation={10} onClick={handleClick}>
                
                <Box sx={{display:"flex",alignItems:"center",height:"80%",justifyContent:"center"}}>
                    {console.log("location",auth)}
                    
                    {console.log("allowedRoles",allowedRoles)}
                    <strong>PGPR SYSTEM</strong>
                </Box>
                <Box style={{height:'20%',display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                    {show && <KeyboardArrowUpIcon fontSize='large'/>}
                    {!show && <KeyboardArrowDownIcon fontSize='large'/>}
                </Box>
            </Paper>
        
            {show && <Paper style={paperStyle2} elevation={10} onClick={handleClick}>
                {<strong>Login as :</strong>}  
                <Box sx={{display:"flex",alignItems:"center",height:"50%",justifyContent:"center"}}>
                    {console.log("location",auth)}
                    
                    {console.log("allowedRoles",allowedRoles)}
                    {allowedRoles.map((role,index)=>{
                        return (
                            <Link key={index} to={`../${role}/dashboard`}><Button style={{margin:'5px'}} variant='outlined'>{role}</Button></Link>
                        )
                    })}
                </Box>
            </Paper>}
        </Box>
    </>
  )
}

export default Start
