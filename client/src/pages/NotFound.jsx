import React, { useEffect } from 'react';
import { Typography, Divider, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import FindInPageIcon from '@mui/icons-material/FindInPage';

const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect (() => {
    document.title = '404 Not Found'
    const root = document.querySelector('#root');
    root.style.backgroundColor = '#fff';
    root.style.backgroundImage = 'none';
    console.log(root)
  }, [])

  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100vh"}}>
      
      <Typography textAlign={"center"} variant="h3" component="div" gutterBottom>
        <span><strong>404</strong></span> Not Found
        <hr />
      </Typography>
      {/* <Divider variant='middle' color='black' /> */}
      <Typography variant="body1" component="div" gutterBottom>
          <p style={{textAlign:"center"}}>The page you are looking for does not exist...</p>
          <p style={{textAlign:"center"}}><FindInPageIcon style={{height:"2rem",width:"2rem"}} /> Sorry! We have searched this page in our whole server. But unfortunately we couldn't find it.</p>
      </Typography>
      {/* <Divider variant='middle' color='black' /> */}
      <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Button style={{margin:"3rem 0",backgroundColor:"black"}} variant='contained' onClick={goBack}>Go Back</Button>
      </div>
      <ReportProblemIcon style={{height:"5rem",width:"5rem"}}/>
      
    </div>
  )
}

export default NotFound
