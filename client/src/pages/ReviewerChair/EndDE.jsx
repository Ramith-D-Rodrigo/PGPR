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


function EndDE() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openDialog, setOpenDialog] = useState(false);
  const {pgprId} = useParams();
  const [SERDetails,setSERDetails] = useState([]);
  const [loading,SetLoading] = useState(false);
  const {reviewerRole, setReviewerRole} = useReviewerRole();
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaId, setCriteriaId] = useState(null);

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
            name: "End DE",
            link: "/PG_Assignments/Conduct_DE/End_DE/"+pgprId
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

      const Criterias = SERDetails?.criterias;
      // const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

      console.log("Criterias : ",Criterias);
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

      <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">End the Desk Evaluation</Divider>

        <TableContainer component={Paper} style={{height:"auto"}}>
          <Table sx={{ height: 200 }} stickyHeader aria-label="sticky table">
              <TableHead>
                  <TableRow>
                      <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria</b></TableCell>
                      <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Final Evaluation</b></TableCell>
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
                          <TableCell align="center">{row.actions}</TableCell>
                      </TableRow>
                  ))}
              </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
            <Button onClick={()=>setOpenDialog(true)} variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Submit the Desk Evaluation Final Results</Button>
        </Box>

        <Dialog
            fullScreen={fullScreen}
            open={openDialog}
            onClose={()=>setOpenDialog(false)}
            aria-labelledby="submit-DE_final_results"
        >
            <DialogTitle id="submit-DE_final_results_ID">
            {"Are you sure you want to Submit the Desk Evaluation Final Results?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText>
                Once you Submit the Final Desk Evaluation Results, you can only view given results.
                So, please make sure that you have given the correct results after discuss with the meeting members.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button autoFocus onClick={()=>setOpenDialog(false)}>
                cancel
            </Button>
            <Button onClick={()=>handleSubmitDE_results()} autoFocus>
                Submit
            </Button>
            </DialogActions>
        </Dialog>
    </>
  )
}

export default EndDE