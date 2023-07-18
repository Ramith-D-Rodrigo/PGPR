import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button';
import {useParams} from 'react-router-dom';
import { Box, Divider } from '@mui/material';

const ViewUniversity = () => {
  const {id} = useParams();
  return (
    <>
        <div>
          uni {id}
        </div>
        <Box
                sx = {{ 
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '16px',
                }}
            >
                <Link to="/qacofficer/universities/add">
                    <Button style={{width:"200px"}} variant="contained">Add a Faculty</Button>
                </Link>
                <Link to="/qacofficer/universities/add">
                    <Button style={{width:"200px"}} variant="contained">Add an Institute</Button>
                </Link>
          </Box>
    </>
  )
}

export default ViewUniversity
