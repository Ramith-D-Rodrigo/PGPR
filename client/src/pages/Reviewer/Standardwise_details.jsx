import React, { useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress, Divider, Chip } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import GetDeEvaluationScores from '../../api/DeskEvaluation/GetDeEvaluationScores';
import getAssignedPGPR from '../../api/Reviewer/getAssignedPGPR';
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';

function Standardwise_details() {
    const {pgprId} = useParams();
    const [criteriaId, setCriteriaId] = useState('');
    const [criteriaList,setCriteriaList] = useState([]);
    const [deskEvaluationId,setDeskEvaluationId] = useState('');
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
                setCriteriaId(response0?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.criterias[0].id);
                setDeskEvaluationId(response0?.data?.data?.postGraduateReviewProgram?.deskEvaluation.id);
                await getevaluationData(response0?.data?.data?.postGraduateReviewProgram?.deskEvaluation.id,response0?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.criterias[0].id);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        getData();
    },[]);

    const getevaluationData=  async(deId,criteriaId)=>{
        if(deId=='' || criteriaId==''){
            return;
        }
        setLoading(true);
        try{
            const response = await GetDeEvaluationScores(deId,criteriaId);
            console.log("DE progress ",response?.data?.data);
            setStandards(response?.data?.data);
            setLoading(false)
        }
        catch (err)
        {
            console.log(err);
            setLoading(false);
        }
    }

    useEffect(() => {
        // get data for selected criteriaId
        getevaluationData(deskEvaluationId,criteriaId);

    }, [criteriaId]);

    //all standards for the current selected criteria
    let allStandards = criteriaList[criteriaId-1]? criteriaList[criteriaId-1].standards : [];

    //filter standards s.t. evaluated ones replace with which are not
    allStandards = allStandards.map((standard,index)=>
    {
        let evaluatedStabndardIndex=-1;
        let isEvaluated = standards.some((evaluatedStandard,index)=>{
            evaluatedStabndardIndex = index;
            return evaluatedStandard.standardNo == standard.standardNo
        });
        return isEvaluated? standards[evaluatedStabndardIndex] : standard;
    })

    //create rows for the table
    const rows = 
        allStandards?
        allStandards.map((standard,index)=>{
            return {no:standard.standardNo,score:standard.score??"not added",review_comments:standard.comment?? "not added"}
        })
        :
        [];
  
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
                <Divider textAlign='left' sx={{width: '100%'}}>
                    <Chip label="Standard Wise Details of the Desk Evaluation" style={{margin:'10px'}}/>
                </Divider>

                <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'10px'}}>
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