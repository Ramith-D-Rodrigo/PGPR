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

function EndDE() {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState([]);
    const [loading,SetLoading] = useState(false);
    const {reviewerRole, setReviewerRole} = useReviewerRole();
    const [openDialog, setOpenDialog] = useState(false);

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
              name: "Submit DE",
              link: "/PG_Assignments/Conduct_DE/Submit_DE/"+pgprId
          }
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
      const getPGPRDetails = async () => {
          SetLoading(true);
          try {
              const response = await getAssignedPGPR(pgprId);
              console.log("PGPR Details : ",response?.data?.data);
              setReviewerRole(response?.data?.data?.reviewerRole);
              SetLoading(false);
          } catch (err) {
              console.error(err);
              SetLoading(false);
          }
      };
      getSERDetails();
      // getPGPRDetails();
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

      const createData = (reviewer,designation,role,progress) => {
        const actions = <Button variant="contained" color="primary"><Link to={`../view_DE_progress/${pgprId}/${reviewer.id}`}>View</Link></Button>
        return {name:reviewer.name,designation,role,progress,actions}
      }

      const rows = [
        createData({id:1,name:"Dr. K. K. K. Perera"},"Senior Lecturer","Chair","100%"),
        createData({id:1,name:"Dr. K. K. K. Perera"},"Senior Lecturer","Reviewer","100%"),
        createData({id:1,name:"Dr. K. K. K. Perera"},"Senior Lecturer","Reviewer","100%"),
      ]
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

            <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">Desk Evaluation Progress</Divider>

            <Box sx={{ display: 'flex', justifyContent: 'space-between',margin:"1rem 0" }}>
                <Typography
                    variant="button"
                    style={{ margin: "0 0 0 20px" }}
                >
                    Desk Evaluation Period : <strong>2023 AUG 12 To 2023 AUG 12</strong>
                </Typography>
                <Typography
                    variant="button"
                    style={{ margin: "0 0 0 20px" }}
                >
                    <strong>1 month and 12 days Remaining</strong>
                </Typography>
            </Box>

            <TableContainer component={Paper} style={{height:"auto"}}>
                <Table sx={{ height: 200 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Name</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Designation</b></TableCell>
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
                            key={row.criteria}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.designation}</TableCell>
                                <TableCell align="center">{row.role}</TableCell>
                                <TableCell align="center">{row.progress}</TableCell>
                                <TableCell align="center">{row.actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
      </>
    )
}

export default EndDE