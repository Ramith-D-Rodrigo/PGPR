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

function Summary_details() {
    const {uniId} = useParams();
    const [reviewerId, setReviewerId] = useState(1);
    const [standards, setStandards] = useState([]);
    const [DEScore, setDEScore] = useState("D");
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
                name: "Summary Details",
                link: "/PG_Assignments/Conduct_DE/Summary_details/"+uniId
            },
        ]
    );

    const rows = [
      {id:1,criterianWiseScore:89,maxRowScore:100,weightageOn1000Scale:889,weightageOnMinScore:89,actualCriteriaStore:89,condition:'Yes'},
      {id:2,criterianWiseScore:89,maxRowScore:100,weightageOn1000Scale:889,weightageOnMinScore:89,actualCriteriaStore:89,condition:'Yes'},
      {id:3,criterianWiseScore:89,maxRowScore:100,weightageOn1000Scale:889,weightageOnMinScore:89,actualCriteriaStore:89,condition:'Yes'},
      {id:4,criterianWiseScore:89,maxRowScore:100,weightageOn1000Scale:889,weightageOnMinScore:89,actualCriteriaStore:89,condition:'Yes'},
      {id:5,criterianWiseScore:89,maxRowScore:100,weightageOn1000Scale:889,weightageOnMinScore:89,actualCriteriaStore:89,condition:'Yes'},
  ];

    const ReviewerList = [
    "Reviewer 1",
    "Reviewer 2",
    "Reviewer 3",
  ]
  return (
    <>
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',maxHeight:'100%',height:'100%',alignItems:'center',margin:'10px'}}>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'2rem 0 0'}}>
            <Typography align='center' fontWeight={600} variant="h6" gutterBottom component="div" style={{marginRight:'20px'}}>
              Criteria Wise Summary Details of Postgraduate programme review
            </Typography>
            <Typography variant="body2" component="h2" gutterBottom>
                Desk Evaluation
            </Typography>
            <FormControl style={{margin:"10px 0",width:"50%"}} variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-reviewer">Reviewer</InputLabel>
              <Select
                labelId="select-reviewer"
                id="reviewer-select"
                value={reviewerId}
                onChange= {(e) => setReviewerId(e.target.value)}
                label="criteria"
              >
                {
                    ReviewerList.map((reviewer,index) => (
                        <MenuItem key={index} value={index+1}>{reviewer}</MenuItem>
                    ))
                }
              </Select>
            </FormControl>
        </Box>
        
          <TableContainer component={Paper} style={{maxHeight:'500%'}}>
              <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria No</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Row Criterian Wise-Score</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Max Row Score</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Weightage on 1000 scale</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Weightage on Minimum Score</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Actual Criteria Wise Score</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Condition (Yes/No)</b></TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      
                      {rows.map((row,index) => (
                          <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell align="left">{row.id}</TableCell>
                              <TableCell align="center">{row.criterianWiseScore}</TableCell>
                              <TableCell align="center">{row.maxRowScore}</TableCell>
                              <TableCell align="center">{row.weightageOn1000Scale}</TableCell>
                              <TableCell align="center">{row.weightageOnMinScore}</TableCell>
                              <TableCell align="center">{row.actualCriteriaStore}</TableCell>
                              <TableCell align="center">{row.condition}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
        
          <Box sx={{display:'flex',justifyContent:'space-between',margin:'10px',width:'100%'}}>
              <Typography variant="h6" component="h2" gutterBottom>
                Desk Evaluation Score : {DEScore}
              </Typography>
              <Button variant="contained" color="primary" style={{margin:'0 10px'}}>Submit the Desk Evaluation</Button>
          </Box>
      </Box>
    </>
  )
}

export default Summary_details