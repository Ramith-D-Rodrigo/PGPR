import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid,Typography,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useDrawerState from '../../hooks/useDrawerState';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';
import createSERRows from '../../assets/reviewer/createSERRows';
import useReviewerRole from '../../hooks/useReviewerRole';
import getAssignedPGPR from '../../api/Reviewer/getAssignedPGPR';
import getAllCriteria from '../../api/Criteria/getAllCriteria';

function DEProgress() {
    const {pgprId} = useParams();
    const [SERDetails,setSERDetails] = useState([]);
    const [loading,SetLoading] = useState(false);
    const [criteriaId, setCriteriaId] = useState(null);
    const [criteriaList, setCriteriaList] = useState([]);
    const {reviewerRole, setReviewerRole} = useReviewerRole();

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
                name: "Finalize DE",
                link: "/PG_Assignments/Conduct_DE/Finalize_DE/"+pgprId
            },
            {
                name: "DE Progress",
                link: "/PG_Assignments/Conduct_DE/view_DE_progress/"+pgprId
            },
        ]
    );


    useEffect(() => {
        document.title = "End the Desk Evaluation process";
        const getSERDetails = async () => {
          SetLoading(true);
          try {
              const response = await getSelfEvaluationReport(pgprId);
              console.log("SER Details : ",response?.data?.data);
              setSERDetails(response?.data?.data);
              setCriteriaList(response?.data?.data?.criterias?? []);
              setCriteriaId(response?.data?.data?.criterias[0]?.id?? "");
              SetLoading(false);
          } catch (err) {
              console.error(err);
              SetLoading(false);
          }
        };
        getSERDetails();
      }, []);
    
      const pgProgrammeDetails = SERDetails?.postGraduateProgramReview?.postGraduateProgramme;
        const facultyDetails = pgProgrammeDetails?.faculty;
        const universityDetails = facultyDetails?.university;
        const pgCoordinatorDetails = pgProgrammeDetails?.programmeCoordinator?.academicStaff?.universitySide?.user;
        const headerInfo = [
            { label: "University:", value: universityDetails?.name?? "" },
            {
              label: "Faculty/Institute:",
              value: facultyDetails?.name?? "",
            },
            { label: "PGPR ID:", value: `PGPR-${pgprId?? ""}` },
            { label: "PGPR Name:", value: pgProgrammeDetails?.title?? "" },
            { label: "Application Start Date:", value: "12/12/2020" },
            { label: "Submission Date:", value: "01/01/2021" },
            { label: "Program Coordinator:", value: `${pgCoordinatorDetails?.initials?? ""} ${pgCoordinatorDetails?.surname?? ""}` },
          ];
    
          
          //setCriteriaId(criteriaList[0]?.id?? "");
          // const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;
    
        //   console.log("Criterias : ",criteriaList);
          // console.log("evidencesForGivenStandards : ",evidencesForGivenStandards);
    
          const rows = [];
    
      return (
        <>
            <DiscriptiveDiv
                description={`${reviewerRole?? ""}`}
                width="100%"
                height="auto"
                backgroundColor="#D8E6FC"
            >
                <Grid container spacing={2}>
                {headerInfo.map((infoItem, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                    <Typography align='left' variant="subtitle1">
                        <b>{infoItem.label}</b>
                    </Typography>
                    <Typography align='left'>{infoItem.value}</Typography>
                    </Grid>
                ))}
                </Grid>
            </DiscriptiveDiv>
        
            <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">Desk Evaluation Progress Overview</Divider>

            <Box sx={{ display: 'flex', justifyContent: 'space-between',margin:"1rem 0" }}>
              <Typography
                  variant="button"
                  style={{ margin: "0 0 0 20px" }}
              >
                  <p>Desk Evaluation Period : <strong>2023 AUG 12 To 2023 AUG 12</strong></p>
                  <p>Reviewer Name : <strong>Reviewer 1</strong></p>
                  <p>Progress : <strong>Completed</strong></p>
              </Typography>
              <Typography
                  variant="button"
                  style={{ margin: "0 0 0 20px" }}
              >
                  <strong>1 month and 12 days Remaining</strong>
              </Typography>
            </Box>
    
            <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'10px'}}>
                <FormControl style={{margin:"3rem 0 2rem",width:"50%"}} variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="select-criteria">Criteria</InputLabel>
                  <Select
                    labelId="select-criteria"
                    id="criteria-select"
                    {...{value:criteriaId?? ""}}
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
    
            <TableContainer component={Paper} style={{height:"auto"}}>
              <Table sx={{ height: 200 }} stickyHeader aria-label="sticky table">
                  <TableHead>
                      <TableRow>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Standard</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Standard Details</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Given Score</b></TableCell>
                          <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Given Comment</b></TableCell>
                      </TableRow>
                  </TableHead>
                    <TableBody>
                      {
                      loading?
                      <TableRow
                      key={1}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell align="center">
                          <div style={{position:'absolute',left:50,right:50,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center"}}> 
                                <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                                    Loading ...
                                </Typography>
                                <CircularProgress
                                style={{ margin: "0 0 0 20px", color: "darkblue" }}
                                thickness={5}
                                size={24}
                                />
                          </div>
                        </TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                        :
                      rows.map((row) => (
                          <TableRow
                          key={row.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row">
                                  {row.id}
                              </TableCell>
                              <TableCell align="center">{row.details}</TableCell>
                              <TableCell align="center">{row.score?? "Not Evaluated Yet"}</TableCell>
                              <TableCell align="center">{row.comment?? "Not Submitted Yet"}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
            </TableContainer>
    
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
                <Link to={`../End_DE/${pgprId}`}><Button variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>End the Desk Evaluation</Button></Link>
            </Box>
        </>
      )
}

export default DEProgress