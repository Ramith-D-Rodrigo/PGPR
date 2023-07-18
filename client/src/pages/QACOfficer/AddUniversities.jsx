import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import {Link} from 'react-router-dom';

const AddUniversities = () => {
  return (
    <>
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
        <Paper elevation={3} />
        </Box>
        <Box
            sx = {{ 
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '16px',
                margin: '10px',
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
