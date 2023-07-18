import React from 'react';
import { Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
    <Typography variant="h1" component="div" gutterBottom>
      <span><strong>404</strong></span> Not Found
      <hr />
    </Typography>
    {/* <Divider variant='middle' color='black' /> */}
    <Typography variant="body1" component="div" gutterBottom>
        <p>The page you are looking for does not exist...</p>
        <strong>check whether the routes defined correctly</strong>
    </Typography>
    {/* <Divider variant='middle' color='black' /> */}
    <Link style={{fontSize:"2rem", color:"red"}} to='/'>Go Back</Link>

      
    </div>
  )
}

export default NotFound
