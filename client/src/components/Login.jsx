import { Grid, Paper,Avatar } from '@mui/material'
import React from 'react'

const Login = () => {

    const paperStyle = {padding:20,height:'70vh',width:'30%',margin:"auto"}

  return (
    <Grid>
        <Paper elevation={10} style = {paperStyle}>
            <Grid>
                <Avatar></Avatar>
                <h2>Sign IN</h2>
            </Grid>
        </Paper>
    </Grid>
  )
}

export default Login
