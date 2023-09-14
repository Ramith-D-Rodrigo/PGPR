import React, { useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';


function UpdateABC() {
    const {pgprId} = useParams();
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "DE",
                link: "/PG_Assignments/Conduct_DE/"+pgprId
            },
            {
                name: "Update Remarks",
                link: "/PG_Assignments/Conduct_DE/UpdateABC/"+pgprId
            },
        ]
    );
  return (
    <DiscriptiveDiv description="Desk Evaluation"  width='100%' height="auto" backgroundColor="#D8E6FC" >
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',maxHeight:'100%',height:'100%',alignItems:'center',margin:'10px'}}>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'2rem'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Update Remarks
            </Typography>
        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section A
            </Typography>
            <Button variant="contained" color="primary">View</Button>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section B
            </Typography>
            <Button variant="contained" color="primary">View</Button>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section D
            </Typography>
            <Button variant="contained" color="primary">View</Button>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
      </Box>

    </DiscriptiveDiv>
  )
}

export default UpdateABC