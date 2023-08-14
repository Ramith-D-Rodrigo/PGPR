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

function Standardwise_details() {
    const {uniId} = useParams();
    const [criteriaId, setCriteriaId] = useState(1);
    const [standards, setStandards] = useState([]);
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "DE",
                link: "/PG_Assignments/Conduct_DE/"+uniId
            },
            {
                name: "Standard Wise Details",
                link: "/PG_Assignments/Conduct_DE/Standardwise_details/"+uniId
            },
        ]
    );

    useEffect(() => {
        // get data for selected criteriaId

    }, [criteriaId]);

    const rows = [
        {no:1.1,score:2,review_comments:"good justification and evidences"},
        {no:1.2,score:3,review_comments:"Very good justification and evidences"},
        {no:1.3,score:3,review_comments:"Very good justification and evidences"},
        {no:1.4,score:3,review_comments:"Very good justification and evidences"},
        {no:1.5,score:3,review_comments:"Very good justification and evidences"},
        {no:1.6,score:3,review_comments:"Very good justification and evidences"},
    ];

    const criteriaList = [
        "Programme Management",
        "P. Design and Development",
        "Human Physical Res. & LS",
        "Teaching Learning Research",
        "Programme Evaluation",
        "Student Assessment & Awards",
        "Innovative & Healthy Practices",
    ]
  
  return (
      <>
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',maxHeight:'100%',height:'100%',alignItems:'center',margin:'10px'}}>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'10px'}}>
            <Typography variant="h5" component="h2" gutterBottom>
                Standard Wise Details
            </Typography>
            <FormControl style={{margin:"10px 0",width:"50%"}} variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-criteria">Criteria</InputLabel>
              <Select
                labelId="select-criteria"
                id="criteria-select"
                value={criteriaId}
                onChange= {(e) => setCriteriaId(e.target.value)}
                label="criteria"
              >
                
                {
                    criteriaList.map((criteria,index) => (
                        <MenuItem key={index} value={index+1}>{criteria}</MenuItem>
                    ))
                }
              </Select>
            </FormControl>
        </Box>
        <TableContainer component={Paper} style={{maxHeight:'500%'}}>
            <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Standard No</b></TableCell>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Score</b></TableCell>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Review Comments</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {rows.map((row,index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left">{row.no}</TableCell>
                            <TableCell align="center">{row.score}</TableCell>
                            <TableCell align="center">{row.review_comments}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Box sx={{display:'flex',justifyContent:'center',margin:'10px'}}>
            <Link to={`../Summary_details/${uniId}`}><Button variant="contained" color="primary" style={{margin:'0 10px'}}>View Summary Details of Criteria Wise</Button></Link>
        </Box>
      </Box>
      </>
  )
}

export default Standardwise_details