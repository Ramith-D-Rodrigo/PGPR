import React, { useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import GetDeskEvaluationProgress from '../../api/DeskEvaluation/getDeskEvaluationProgress';
import getAssignedPGPR from '../../api/Reviewer/getAssignedPGPR';

function Standardwise_details() {
    const {pgprId} = useParams();
    const [criteriaId, setCriteriaId] = useState('');
    const [criteriaList,setCriteriaList] = useState([]);
    const [standards, setStandards] = useState([]);
    const [loading,setLoading] = useState(false)
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
                name: "Standard Wise Details",
                link: "/PG_Assignments/Conduct_DE/Standardwise_details/"+pgprId
            },
        ]
    );

    useEffect(()=>{
        const getData = async () =>{
            setLoading(true);
            try{
                const response0 = await getAssignedPGPR(pgprId);
                console.log("PGPR details ", response0?.data?.data);
                setCriteriaList(response0?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.criterias);
                setCriteriaId('1');
                // const response = await GetDeskEvaluationProgress(response0?.data?.data?.postGraduateReviewProgram?.deskEvaluation.id,1);
                // console.log("DE progress ",response?.data?.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        getData();
    },[]);

    useEffect(() => {
        // get data for selected criteriaId
        console.log("selected ",criteriaList[criteriaId-1]);

    }, [criteriaId]);

    const rows = [
        {no:1.1,score:2,review_comments:"good justification and evidences"},
        {no:1.2,score:3,review_comments:"Very good justification and evidences"},
        {no:1.3,score:3,review_comments:"Very good justification and evidences"},
        {no:1.4,score:3,review_comments:"Very good justification and evidences"},
        {no:1.5,score:3,review_comments:"Very good justification and evidences"},
        {no:1.6,score:3,review_comments:"Very good justification and evidences"},
    ];
  
  return (
      <>
        {loading?
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}> 
                <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                    Loading ...
                </Typography>
                <CircularProgress
                style={{ margin: "0 0 0 20px", color: "darkblue" }}
                thickness={5}
                size={24}
                />
            </div>
            :
            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',maxHeight:'100%',height:'100%',alignItems:'center',margin:'10px'}}>
                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'10px'}}>
                    <Typography align='center' fontWeight={600} variant="h6" gutterBottom component="div" style={{marginRight:'20px'}}>
                        Standard Wise Details of Postgraduate programme review
                    </Typography>
                    <FormControl style={{margin:"3rem 0 2rem",width:"50%"}} variant="standard" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="select-criteria">Criteria</InputLabel>
                    <Select
                        labelId="select-criteria"
                        id="criteria-select"
                        value={criteriaList? criteriaId : ''}
                        onChange= {(e) => setCriteriaId(e.target.value)}
                        label="criteria"
                    >
                        
                        {
                            criteriaList.map((criteria,index) => (
                                <MenuItem key={index} value={criteria.id}>{criteria.name}</MenuItem>
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
                    <Link to={`../Summary_details/${pgprId}`}><Button variant="contained" color="primary" style={{margin:'0 10px'}}>View Summary Details of Criteria Wise</Button></Link>
                </Box>
            </Box>
        }
      </>
  )
}

export default Standardwise_details