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
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';
import SubmitDeskEvaluation from '../../api/Reviewer/SubmitDeskEvaluation';
import StatusMessage from '../../components/StatusMessage';
import { useNavigate } from 'react-router-dom';
import GetDeskEvaluationProgress from '../../api/DeskEvaluation/getDeskEvaluationProgress';
import DialogMenu from '../../components/DialogMenu';

const SubmitDE = () => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState([]);
    const [pgprDetails,setPGPRDetails] = useState([]);
    const [criteriaProgress, setCriteriaProgress] = useState([]);
    const [loading,SetLoading] = useState(false);
    const {reviewerRole, setReviewerRole} = useReviewerRole();
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        document.title = "End the Desk Evaluation Process";
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
                const response3 = await GetDeskEvaluationProgress(response1?.data?.data?.postGraduateReviewProgram?.deskEvaluation?.id);
                console.log("DE Progress : ",response3?.data?.data);
                setCriteriaProgress(response3.data.data);
                SetLoading(false);
            } catch (err) {
                console.error(err);
                SetLoading(false);
            }
        };
        getPGPRDetails();
    }, []);

    function createData(criteriaData,DE_progress) {
        const Actions = [<Link key={1} to={`../${pgprId}/${criteriaData.id}`}><Button style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{"Update"}</Button></Link>]
        return {criteria:criteriaData.name, DE_progress, Actions };
    }

    const handleSubmitDE_results = async() => {
        SetLoading(true);
        try{
            const response = await SubmitDeskEvaluation(pgprDetails?.data?.postGraduateReviewProgram?.deskEvaluation);
            console.log("Submit DE Results : ",response);
            SetLoading(false);
            setError({status:response?.status, msg:response?.data?.message});
            if(response?.status==200){
                navigate(`../${pgprId}`);
            }
        }
        catch(err){
            console.error(err);
            SetLoading(false);
            setError({status:err?.response?.status, msg:err?.response?.data?.message});
        }
        setOpenDialog(false);
    };

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
  
    const rows = criteriaProgress? criteriaProgress.map((criteria,index) => {
        let criteriaData = {name : criteria.criteriaName, id:criteria.criteriaId}
        let De_Progress = `${criteria.evaluatedStandards}/${criteria.totalStandards}` 
        return createData(criteriaData,De_Progress)
    } )  : [];

    return (
        <>
        {
            loading? (
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            )
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
                                <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Desk Evaluation Progress</b></TableCell>
                                <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                rows.map((row) => (
                                    <TableRow
                                    key={row.criteria}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.criteria}
                                        </TableCell>
                                        <TableCell align="center">{row.DE_progress}</TableCell>
                                        <TableCell align="center">{row.Actions}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
                    <Button onClick={()=>setOpenDialog(true)} variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Submit the Desk Evaluation Final Results</Button>
                </Box>

                <DialogMenu 
                    Message="Are you sure you want to Submit the Desk Evaluation Final Results?" 
                    Warning="Once you Submit the Final Desk Evaluation Results, you can only view given results.
                    So, please make sure that you have given the correct results after discuss with the meeting members." 
                    Actions={{submit:"Submit",
                    cancel:"cancel"}} 
                    Open={openDialog}
                    onClose={()=>setOpenDialog(false)}
                    onSubmit={()=>handleSubmitDE_results()}>
                </DialogMenu>

                <StatusMessage
                    open={error==null? false : true}
                    onClose={()=>setError(null)}
                    message={error?.msg}
                    severity={error?.status==200? "success" : "error"}
                    autoHideDuration={error?.status==200? 2000 : null}
                />
            </>
        }
        </>
    )
}



export default SubmitDE

