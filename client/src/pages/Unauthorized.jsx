import React, { useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect (() => {
    document.title = 'Unauthorized Access'
    const root = document.querySelector('#root');
    root.style.backgroundColor = '#fff';
    root.style.backgroundImage = 'none';
  }, [])

  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      
      <Typography textAlign={"center"} variant="h3" component="div" gutterBottom>
        <span><strong>401</strong></span> Unauthorized Access <strong>:\</strong>
        <hr />
      </Typography>

      <Typography variant="body1" component="div" gutterBottom>
          <p style={{textAlign:"center"}}>Hey, Stop Right There !</p>
          <p style={{textAlign:"center"}}><ReportProblemIcon style={{height:"8rem",width:"8rem"}} /> <strong>Not Allowed!</strong> You are not Authorized to access this content </p>
      </Typography>
      
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Button style={{margin:"3rem 0",backgroundColor:"black"}} variant='contained' onClick={goBack}>Go Back</Button>
      </div>
      
    </div>
  )
}

export default NotFound
