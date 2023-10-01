import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid,Typography,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import useDrawerState from '../../hooks/useDrawerState';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';
import createSERRows from '../../assets/reviewer/createSERRows';
import useReviewerRole from '../../hooks/useReviewerRole';
import getAssignedPGPR from '../../api/Reviewer/getAssignedPGPR';
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';

const ConductDE = () => {
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState([]);
    const [loading,SetLoading] = useState(false);
    const {reviewerRole, setReviewerRole} = useReviewerRole();
    // const [SERId,setSERId] = useState([]);
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
            }
        ]
    );

    useEffect(() => {
        document.title = "Conduct Desk Evaluation";
        const getPGPRDetails = async () => {
            SetLoading(true);
            try {
                const response1 = await getSpecificPGPR(pgprId);
                console.log("PGPR Details : ",response1?.data);
                setPGPRDetails(response1?.data);
                setReviewerRole(response1?.data?.data?.role);
                // setSERId(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
                const response2 = await getSelfEvaluationReport(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
                console.log("SER Details : ",response2?.data?.data);
                setSERDetails(response2?.data?.data);
                SetLoading(false);
            } catch (err) {
                console.error(err);
                SetLoading(false);
            }
        };
        getPGPRDetails();
    }, []);

    function createData(criteriaData,submitted_standards, y1,y2,y3,y4,y5) {
        const DE = pgprDetails?.data?.postGraduateReviewProgram?.deskEvaluation;
        let ButtonName;
        let linkDisabled = false;
        if (DE?.status == "COMPLETED"){
            ButtonName = "View";
        }
        else if (DE?.status == "ONGOING"){
            ButtonName = "Evaluate";
        }
        else{
            ButtonName = "Error";
            linkDisabled = true;
        }
        if(new Date(DE?.endDate) <= new Date()){
            ButtonName = ButtonName=="Error" ? ButtonName : "View";
        }
        const Actions = [<Link key={1} to={ linkDisabled? '' :`${criteriaData.id}`}><Button disabled={linkDisabled} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{ButtonName}</Button></Link>]
        return {criteria:criteriaData.name, submitted_standards, y1,y2,y3,y4,y5, Actions };
    }

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);

    let bodyHeight = open ==true? `${80-expand}%` : `calc( ${80-expand}% - 60px )`;
    let tableHeight = expand ==8? {} : {height:'300px'};

    let newHeight = open ==true? `${80-expand}%` : `calc( ${80-expand}% - 40px )`;
    const handleClick = ()=>{
        if(expand==8)
        {
        setexpand(descriptionWidth);
        }
        else{
        setexpand(8);
        }
    };

    const headerRowStyle = {
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', padding: '0 20px', fontSize: '16px',borderBottom: '1px solid #00000020'
    };

    const headerRowDivStyle = {width:'50%',textAlign:'left'};

    const pgProgrammeDetails = SERDetails?.postGraduateProgramReview?.postGraduateProgramme;
    const facultyDetails = pgProgrammeDetails?.faculty;
    const universityDetails = facultyDetails?.university;
    const pgCoordinatorDetails = pgProgrammeDetails?.programmeCoordinator?.academicStaff?.universitySide?.user;
    const DE = pgprDetails?.data?.postGraduateReviewProgram?.deskEvaluation;
    const headerInfo = [
        { label: "University:", value: universityDetails?.name?? "" },
        {
          label: "Faculty/Institute:",
          value: facultyDetails?.name?? "",
        },
        { label: "PGPR ID:", value: `PGPR-${pgprId?? ""}` },
        { label: "PGPR Name:", value: pgProgrammeDetails?.title?? "" },
        { label: "Application Start Date:", value: DE?.startDate?? "", color: new Date(DE?.startDate) <= new Date()? "blue" : "red" },
        { label: "Submission Date:", value: DE?.endDate?? "", color: new Date(DE?.endDate) <= new Date()? "red" : "blue" },
        { label: "Program Coordinator:", value: `${pgCoordinatorDetails?.initials?? ""} ${pgCoordinatorDetails?.surname?? ""}` },
      ];

      const Criterias = SERDetails?.criterias;
      const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

    //   console.log("Criterias : ",Criterias);
    //     console.log("evidencesForGivenStandards : ",evidencesForGivenStandards);
  
      const rows = Criterias? createSERRows(SERDetails?.criterias,SERDetails?.evidenceGivenStandards,createData) : [];

    return (
        <>
            {
                loading? <CircularProgress style={{position:'absolute',top:'50%',left:'50%'}}/>
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
                            <Typography color={infoItem?.color?? ""} align='left'>{infoItem.value}</Typography>
                            </Grid>
                        ))}
                        </Grid>
                    </DiscriptiveDiv>

                    <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">Desk Evaluation</Divider>
            
                    <TableContainer component={Paper} style={{height:"auto"}}>
                        <Table sx={{ height: 650 }} stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Submitted Standards</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Evidences</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Actions</b></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y1</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y2</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y3</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y4</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y5</b></TableCell>
                                    <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                loading?
                                    <TableRow>
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
                                    </TableRow>
                                    :
                                rows.map((row) => (
                                    <TableRow
                                    key={row.criteria}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.criteria}
                                        </TableCell>
                                        <TableCell align="center">{row.submitted_standards}</TableCell>
                                        <TableCell align="center">{row.y1}</TableCell>
                                        <TableCell align="center">{row.y2}</TableCell>
                                        <TableCell align="center">{row.y3}</TableCell>
                                        <TableCell align="center">{row.y4}</TableCell>
                                        <TableCell align="center">{row.y5}</TableCell>
                                        <TableCell align="center">{row.Actions}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
                            <Link to = {`../UpdateABC/${pgprId}`}><Button variant="contained" size="small" style={{width:"250px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Update Part A, B, D</Button></Link>
                            <Link to = {`../Standardwise_details/${pgprId}`}><Button variant="contained" size="small" style={{width:"250px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>View Standards Wise Details of Desk Review</Button></Link>
                            <Link to = {`../Submit_DE/${pgprId}`}><Button variant="contained" size="small" style={{width:"250px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Submit The Self Evaluated Results</Button></Link>
                            {/* only for chair */}
                            <Link to = {`../Finalize_DE/${pgprId}`}><Button variant="contained" size="small" style={{width:"250px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Finalize The Desk Evaluation</Button></Link>
                    </Box>
                </>
            }
        </>
    )
}

export default ConductDE

