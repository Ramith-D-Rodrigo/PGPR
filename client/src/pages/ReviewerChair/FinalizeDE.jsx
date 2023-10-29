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
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import GetDEprogress from '../../api/reviewChair/getDEprogress';

function FinalizeDE() {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState([]);
    const [loading,SetLoading] = useState(false);
    const {reviewerRole, setReviewerRole} = useReviewerRole();
    const [reviewTeam,setReviewTeam] = useState([]);
    const [deProgress,setDeProgress] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [pgprDetails,setPGPRDetails] = useState([]);

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
      ]
    );

    useEffect(() => {
      document.title = "End the Desk Evaluation process";
      const getSERDetails = async () => {
          SetLoading(true);
          try {
              const response = await getSelfEvaluationReport(pgprDetails?.postGraduateReviewProgram?.selfEvaluationReport?.id);
              console.log("SER Details : ",response?.data?.data);
              setSERDetails(response?.data?.data);
              SetLoading(false);
          } catch (err) {
              console.error(err);
              SetLoading(false);
          }
      };
      const getPGPRDetails = async () => {
          SetLoading(true);
          try {
              const response0 = await getAssignedPGPR(pgprId);
              console.log("PGPR Details : ",response0?.data?.data);
              setReviewerRole(response0?.data?.data?.role);
              if(response0?.data?.data?.role != "CHAIR") history.back();
              setPGPRDetails(response0?.data?.data);
              const response = await getPGPR(pgprId);
              console.log("2nd req pgpr details ",response?.data?.data);
              setReviewTeam(response?.data?.data?.acceptedReviewTeam);
              const response1 = await GetDEprogress(response?.data?.data?.acceptedReviewTeam?.id,response?.data?.data?.deskEvaluation?.id)
              console.log("de progress :",response1?.data?.data);
              setDeProgress(response1?.data?.data);
              SetLoading(false);
          } catch (err) {
              console.error(err);
              SetLoading(false);
          }
      };
      getPGPRDetails();
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

      const Criterias = SERDetails?.criterias;
      // const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

    //   console.log("Criterias : ",Criterias);
      // console.log("evidencesForGivenStandards : ",evidencesForGivenStandards);

      const createData = (reviewer,role,progress) => {
        const actions = <Link key={1} to={`../view_DE_progress/${pgprId}/${reviewer.id}`}><Button variant="contained" color="primary">View</Button></Link>
        // console.log({id:reviewer.id,name:reviewer.name,role,progress,actions});
        return {id:reviewer.id,name:reviewer.name,role,progress,actions}
      }

      const rows = reviewTeam ?.reviewers? 
        reviewTeam.reviewers.map((reviewer,index)=>{
            let progress = 0;
            deProgress.forEach((de_reviewer)=>{
                if(de_reviewer.reviewerId == reviewer.userData.id)
                {
                    let noOfStandards=0;
                    let noOfEvaluatedStandard=0;
                    de_reviewer.criteriaData.forEach((criteria)=>{
                        noOfStandards+=criteria.totalStandards;
                        noOfEvaluatedStandard+=criteria.evaluatedStandards;
                    });
                    progress = Math.trunc(noOfEvaluatedStandard/noOfStandards*100)+"%";
                }
            })
            return createData({id:reviewer.userData.id,name:reviewer.userData.initials+"."+reviewer.userData.surname},reviewer.role,progress)
        })
        :
        [];

        console.log("rows: ",rows);

    function getRemainingDates(endDate) {
        const endDateObject = new Date(endDate);
        const currentDate = new Date();

        const millisecondsInADay = 1000 * 60 * 60 * 24;
        const millisecondsDifference = endDateObject.getTime() - currentDate.getTime();
        
        const daysRemaining = millisecondsDifference / millisecondsInADay;
        const monthsRemaining = Math.floor(daysRemaining / 30);
        const daysRemainingAfterMonths = daysRemaining % 30;
        
        return monthsRemaining>0? `${monthsRemaining} months and` : `` + `${Math.ceil(daysRemainingAfterMonths)} day(s) Remaining`;
    }


    return (
      <>
        {
            loading?
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

            <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">Desk Evaluation Progress</Divider>

            <Box sx={{ display: 'flex', justifyContent: 'space-between',margin:"1rem 0" }}>
                <Typography
                    variant="button"
                    style={{ margin: "0 0 0 20px" }}
                >
                    Desk Evaluation Period : <strong>{`${pgprDetails?.postGraduateReviewProgram?.deskEvaluation?.startDate} To ${pgprDetails?.postGraduateReviewProgram?.deskEvaluation?.endDate}`}</strong>
                </Typography>
                <Typography
                    variant="button"
                    style={{ margin: "0 0 0 20px" }}
                >
                    <strong>{getRemainingDates(pgprDetails?.postGraduateReviewProgram?.deskEvaluation?.endDate)}</strong>
                </Typography>
            </Box>

            <TableContainer component={Paper} style={{height:"auto"}}>
                <Table sx={{ height: 200 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Name</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Role</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Progress</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Actions</b></TableCell>
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
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.role}</TableCell>
                                <TableCell align="center">{row.progress}</TableCell>
                                <TableCell align="center">{row.actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
                <Link to={`../End_DE/${pgprId}`}><Button variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>End the Desk Evaluation</Button></Link>
            </Box>
            </>
}
    </>
    )
}

export default FinalizeDE