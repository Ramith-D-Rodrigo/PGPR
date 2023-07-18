import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Box, Divider } from '@mui/material';
import {Link} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ScrollableDiv from '../../components/ScrollableDiv';

const AddUniversities = () => {

    const paperStyle = {padding:20,height:'550px',width:'100%',margin:"auto",borderRadius:"2px"}

    return (
        <>
            <ScrollableDiv height='550px'>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: 128,
                height: 128,
                },
            }}
            >
            <Paper elevation={3} style={paperStyle}>
                <Typography align='center' variant="h6" gutterBottom component="div">
                    General Details
                </Typography>
                <Divider/>

            {/* </Paper>
            <Paper elevation={3} style={paperStyle}> */}

                <Typography align='center' variant="h6" gutterBottom component="div">
                    Autorities Details
                </Typography>
                <Divider/>
            </Paper>

            </Box>
            </ScrollableDiv>
            <Box
                sx = {{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '16px',
                }}
            >
                <Link to="/qacofficer/universities/add">
                    <Button style={{width:"100px"}} variant="contained">Add</Button>
                </Link>
                <Link to="/qacofficer/universities/add">
                    <Button style={{width:"100px"}} variant="contained">Cancel</Button>
                </Link>
            </Box>
            
        </>
    )
}

export default AddUniversities
