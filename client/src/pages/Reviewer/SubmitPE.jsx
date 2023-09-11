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

const SubmitPE = () => {
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
                name: "Submit PE",
                link: "/PG_Assignments/Conduct_PE/Submit_PE/"+pgprId
            }
        ]
    );

    useEffect(() => {
        document.title = "Submit Proper Evaluation";
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

    function createData(criteriaData,PE_progress) {
        const Actions = [<Link key={1} to={`../${pgprId}/${criteriaData.id}`}><Button style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{"Update"}</Button></Link>]
        return {criteria:criteriaData.name, PE_progress, Actions };
    }

    const handleSubmitPE_results = () => {
        // API call to submit the DE results
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
      const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

      console.log("Criterias : ",Criterias);
        console.log("evidencesForGivenStandards : ",evidencesForGivenStandards);
  
    //   const rows = Criterias? createSERRows(SERDetails?.criterias,SERDetails?.evidenceGivenStandards,createData) : [];

      const rows = [
        createData({name:"Programme Management",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"P. Design and Development",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"Human Physical Res. & LS",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"Teaching Learning Research",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"Programme Evaluation",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"Student Assessment & Awards",id:1}, "20/23" , [{action:'Update',allow:true}]),
        createData({name:"Innovative & Healthy Practices",id:1}, "20/23" , [{action:'Update',allow:true}]),
      ];

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

            <Divider style={{margin:"2rem 0 1rem"}} textAlign="center">Proper Evaluation</Divider>
    
            <TableContainer component={Paper} style={{height:"auto"}}>
                <Table sx={{ height: 650 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Proper Evaluation Progress</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                        loading?
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
                            :
                        rows.map((row) => (
                            <TableRow
                            key={row.criteria}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.criteria}
                                </TableCell>
                                <TableCell align="center">{row.PE_progress}</TableCell>
                                <TableCell align="center">{row.Actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '20px 0',height:"auto" }}>
                    <Button onClick={()=>setOpenDialog(true)} variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Submit The Proper Evaluation Results</Button>
            </Box>

            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={()=>setOpen(false)}
                aria-labelledby="submit-PE_results"
            >
                <DialogTitle id="submit-PE_results_ID">
                {"Are you sure that you want to Reject this postgraduate programme review assignment?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Once you Submit the Proper Evaluation Results, you can't undo this action.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={()=>setOpenDialog(false)}>
                    cancel
                </Button>
                <Button onClick={()=>handleSubmitPE_results()} autoFocus>
                    Submit
                </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default SubmitPE

