import { Box, ButtonGroup, Chip, Dialog, Divider } from '@mui/material';
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth'
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Button, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import getAllReviewers from '../../api/Reviewer/getAllReviewers';
import submitReviewTeam from '../../api/ReviewTeam/submitReviewTeam';
import removePendingReviewTeam from '../../api/ReviewTeam/removePendingReviewTeam';
import { Alert, Snackbar } from '@mui/material';
import {CircularProgress} from '@mui/material';
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import groupPGPRs from '../../api/PostGraduateProgramReview/groupPGPRS';

const ViewPGPR = () => {
    const { pgprId, serId } = useParams();

    const [pgpr, setPgpr] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useAuth();

    useEffect(() => {
        const pgprResults = async () => {
            try {
                const pgprResults = await getPGPR(pgprId);

                if (pgprResults.status) {
                    setPgpr(pgprResults.data.data);
                    console.log(pgprResults.data.data);

                    const acceptedReviewTeam = pgprResults.data.data.acceptedReviewTeam?.reviewers;

                    if (acceptedReviewTeam) {
                        setReviewerChair(acceptedReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'chair')[0]);
                        setReviewer1(acceptedReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'member')[0]);
                        setReviewer2(acceptedReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'member')[1]);
                    }
                    else {
                        const pendingReviewTeam = pgprResults.data.data.pendingReviewTeam?.reviewers;

                        if (pendingReviewTeam) {
                            setReviewerChair(pendingReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'chair')[0]);
                            setReviewer1(pendingReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'member')[0]);
                            setReviewer2(pendingReviewTeam.filter(reviewer => reviewer.role.toLowerCase() === 'member')[1]);
                        }
                    }
                }

                setLoading(false);

            }
            catch (error) {
                console.log(error);
            }

        }
        pgprResults();
    }, [pgprId]);

    const reviewTeam = pgpr?.acceptedReviewTeam?.reviewers;
    const status = pgpr?.acceptedReviewTeam?.status;

    const deskEvaluation = pgpr?.deskEvaluation;
    const finalReports = pgpr?.finalReports;

    const groupDetails = pgpr?.groupWith;
    const properEvaluation = pgpr?.properEvaluation;

    const pgprStatus = pgpr?.statusOfPgpr;
    const postGraduateProgram = pgpr?.postGraduateProgramme;//title
    const faculty = pgpr?.postGraduateProgramme?.faculty;//name
    const university = pgpr?.postGraduateProgramme?.faculty?.university;//name
    const selfEvaluationReport = pgpr?.selfEvaluationReport;
    const Coordinator = pgpr?.selfEvaluationReport?.programmeCoordinator;

    const [reviewerChair, setReviewerChair] = useState(null);
    const [reviewer1, setReviewer1] = useState(null);
    const [reviewer2, setReviewer2] = useState(null);

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpen2(false);
    };

    const handleGroupClickOpen = () => {
        setOpen2(true);
    };

    const [reviewers, setReviewers] = useState([]);
    const [pgprs, setPgprs] = useState([]);

    //get all the reviewers
    useEffect(() => {
        const fetchReviewers = async () => {
            try {
                const reviewers = await getAllReviewers();
                if (reviewers.status) {
                    console.log('reviewers', reviewers.data.data);
                    setReviewers(reviewers.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }

        const fetchPGPRs = async () => {
            try {
                const pgprs = await getAllPGPRs();

                if (pgprs.status) {
                    console.log('pgprs', pgprs.data.data);
                    setPgprs(pgprs.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        
        
        fetchReviewers();
        fetchPGPRs();
    }, []);

    const handleSubmitReviewTeam = async () => {
        //submit the review team to the dean
        console.log('submit review team');

        if (reviewerChair && reviewer1 && reviewer2) {
            const requestBody = {
                'pgprId': pgprId,

                'reviewers': [
                    {
                        'reviewerId': reviewerChair.userData.id,
                        'position': 'chair'
                    },

                    {
                        'reviewerId': reviewer1.userData.id,
                        'position': 'member'
                    },

                    {
                        'reviewerId': reviewer2.userData.id,
                        'position': 'member'
                    }
                ]
            }

            try {
                setSnackbar({
                    open: true,
                    message: 'Submitting Review Team...',
                    severity: 'info'
                });

                const response = await submitReviewTeam(requestBody);

                if (response && response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: 'Review Team Submitted Successfully',
                        severity: 'success'
                    });
                }
                else {
                    setSnackbar({
                        open: true,
                        message: 'Review Team Submission Failed',
                        severity: 'error'
                    });
                }
            }
            catch (error) {
                console.log(error);
                setSnackbar({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                });
            }
        }
    }

    const handleRemoveReviewTeam = async () => {
        //remove the current pending review team
        console.log('remove review team ' + pgpr.pendingReviewTeam?.id);

        if (pgpr.pendingReviewTeam?.id) {
            try {
                setSnackbar({
                    open: true,
                    message: 'Removing Review Team...',
                    severity: 'info'
                });

                const response = await removePendingReviewTeam(pgpr.pendingReviewTeam?.id);

                if (response && response.status === 200) {
                    setSnackbar({
                        open: true,
                        message: 'Review Team Removed Successfully',
                        severity: 'success'
                    });
                }
            }
            catch (error) {
                setSnackbar({
                    open: true,
                    message: error.response.data.message,
                    severity: 'error'
                });
            }
        }
        else {
            setSnackbar({
                open: true,
                message: 'No Pending Review Team to Remove',
                severity: 'error'
            });
        }
    }

    const handleGrouping = async (id) => {
        try{
            setSnackbar({
                open: true,
                message: 'Grouping PGPRs...',
                severity: 'info'
            });

            const response = await groupPGPRs(pgprId, id);

            if (response && response.status === 200) {
                setSnackbar({
                    open: true,
                    message: 'PGPRs Grouped Successfully',
                    severity: 'success'
                });
            }

            setOpen2(false);
        }
        catch(error){
            setSnackbar({
                open: true,
                message: error.response.data.message,
                severity: 'error'
            });
        }
    }



    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    //we have to get the final report separately

    const secondaryBoxStyle = { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '50%', mt: 2, minHeight: '60vh' };
    const detailedBox = { display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%', margin: "1rem" };
    const itemBox = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '90%', margin: "0.2rem 0" };

    return (
        <>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>


            <Divider textAlign='left'>
                <Chip label="Details of Postgraduate Programe Review" sx={{ m: 2 }} />
            </Divider>

            {
                loading ?
                    <Box sx={detailedBox}>
                        <CircularProgress />
                    </Box>
                    :
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row', mt: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ ...secondaryBoxStyle, borderRight: "1px solid black" }}>

                            <Divider><strong>General Details</strong></Divider>
                            <Box sx={detailedBox}>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Postgraduate Programe Review ID
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {"PGPR - " + pgprId}
                                    </Typography>
                                </Box>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Postgraduate Programme
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {postGraduateProgram?.title}
                                    </Typography>
                                </Box>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Status of PGPR
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {pgprStatus}
                                    </Typography>
                                </Box>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        University
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {university?.name}
                                    </Typography>
                                </Box>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Faculty
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {faculty?.name}
                                    </Typography>
                                </Box>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Programme Coordinator
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        {pgpr?.selfEvaluationReport?.programmeCoordinator?.academicStaff.universitySide.user.initials + " " + pgpr?.selfEvaluationReport?.programmeCoordinator?.academicStaff.universitySide.user.surname}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ ...secondaryBoxStyle, borderLeft: "1px" }}>

                            <Divider><strong>Grouped Details</strong></Divider>
                            <Box sx={detailedBox}>
                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Grouped with
                                    </Typography>
                                    <Box sx={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                                        {

                                            groupDetails ?
                                                <Box sx={{ display: 'flex' }}>
                                                    {
                                                        groupDetails.map((group) => {
                                                            <Box key={group.id} sx={{ display: 'flex', alignItems: 'center', boxShadow: "0px 0px 0px 1px lightgray inset", borderRadius: 5, padding: '0.3rem 0.5rem', ml: 0.5 }}>
                                                                <Typography align='left'>
                                                                    {`${group?.id}`}
                                                                </Typography>
                                                                <CloseIcon fontSize='small' sx={{ cursor: 'pointer', ml: 1, ':hover': { color: 'red' } }} />
                                                            </Box>
                                                        })
                                                    }
                                                </Box>
                                                :
                                                <Typography variant="h6" align='left'>
                                                    Not Grouped
                                                </Typography>
                                        }
                                    </Box>
                                </Box>
                                {
                                    (auth?.authRole[0] === 'qac_officer' || auth?.authRole[0] === 'qac_director')  &&
                                    <Box sx={itemBox}>
                                        <Typography variant="h6" align='left'>
                                            Edit Group
                                        </Typography>
                                        <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={snackbar.open} onClick={() => handleGroupClickOpen()}>Add a PGPR</Button>
                                    </Box>
                                }
                            </Box>

                            <Divider><strong>Review Team & Their Universities</strong></Divider>
                            <Box sx={detailedBox}>
                                <Box sx={itemBox}>
                                    <Box align='left'>
                                        <Typography variant="h6" sx={{ mb: 1 }} align='left'>
                                            Chair
                                        </Typography>
                                        <Typography variant="h6" sx={{ mb: 1 }} align='left'>
                                            Reviewer 1
                                        </Typography>
                                        <Typography variant="h6" sx={{ mb: 1 }} align='left'>
                                            Reviewer 2
                                        </Typography>
                                    </Box>
                                    {
                                        (auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director') &&
                                        <Box align='left' sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={status?.toLowerCase() === 'accepted' || snackbar.open} onClick={() => handleClickOpen()}>Select</Button>
                                            <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={status?.toLowerCase() === 'accepted' || snackbar.open} onClick={() => handleClickOpen()}>Select</Button>
                                            <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={status?.toLowerCase() === 'accepted' || snackbar.open} onClick={() => handleClickOpen()}>Select</Button>
                                        </Box>
                                    }
                                    <Box align='left'>
                                        <Typography key={reviewerChair?.userData?.id + 'selectedChair'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewerChair?.userData?.initials + " " + reviewerChair?.userData?.surname}
                                        </Typography>
                                        <Typography key={reviewer1?.userData?.id + 'selectedMember1'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewer1?.userData?.initials + " " + reviewer1?.userData?.surname}
                                        </Typography>
                                        <Typography key={reviewer2?.userData?.id + 'selectedMember2'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewer2?.userData?.initials + " " + reviewer2?.userData?.surname}
                                        </Typography>
                                    </Box>

                                    <Box align='left'>
                                        <Typography key={reviewerChair?.userData?.id + 'selectedChair'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewerChair?.reviewerConfirmation ?? 'Not Confirmed'}
                                        </Typography>
                                        <Typography key={reviewer1?.userData?.id + 'selectedMember1'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewer1?.reviewerConfirmation ?? 'Not Confirmed'}
                                        </Typography>
                                        <Typography key={reviewer2?.userData?.id + 'selectedMember2'} variant="h6" sx={{ mb: 1 }} align='left'>
                                            {reviewer2?.reviewerConfirmation ?? 'Not Confirmed'}
                                        </Typography>
                                    </Box>

                                </Box>

                                <Box sx={itemBox}>
                                    <Typography variant="h6" align='left'>
                                        Team Status : {status}
                                    </Typography>
                                    <Typography variant="h6" align='left'>
                                        Dean Decision : {pgpr?.acceptedReviewTeam?.deanDecision}
                                    </Typography>
                                </Box>

                                {(auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director') && (pgpr.statusOfPgpr === 'PLANNING' || pgpr.statusOfPgpr === 'SUBMITTED') &&
                                    <Box sx={itemBox}>
                                        <Box align='left'>
                                            <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={status?.toLowerCase() === 'accepted' || snackbar.open} onClick={() => handleSubmitReviewTeam()}>Submit Review Team to Dean</Button>
                                        </Box>
                                        <Box align='left'>
                                            <Button variant='outlined' size='small' sx={{ mb: 1 }} color="primary" disabled={status?.toLowerCase() === 'accepted' || snackbar.open} onClick={() => handleRemoveReviewTeam()}>Remove Review Team</Button>
                                        </Box>
                                    </Box>
                                }

                            </Box>

                            <Divider><strong>Evaluations</strong></Divider>
                            <Box sx={detailedBox}>
                                <Box sx={{ ...itemBox, flexWrap: 'wrap' }}>

                                    <Typography variant="h6" align='left'>
                                        Desk Evaluation
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {deskEvaluation ? deskEvaluation?.status : "Not Started"}
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {deskEvaluation ? deskEvaluation?.startDate ? `from ${deskEvaluation?.startDate}` : "" : ""}
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {deskEvaluation ? deskEvaluation?.endDate ? `to ${deskEvaluation?.endDate}` : "" : ""}
                                    </Typography>
                                </Box>
                                <Box sx={{ ...itemBox, flexWrap: 'wrap' }}>
                                    <Typography variant="h6" align='left'>
                                        Proper Evaluation
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {properEvaluation ? properEvaluation?.status : "Not Started"}
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {properEvaluation ? properEvaluation.startDate ? `from ${properEvaluation?.startDate}` : "" : ""}
                                    </Typography>
                                    <Typography variant="body" align='left'>
                                        {properEvaluation ? properEvaluation?.endDate ? `to ${properEvaluation?.endDate}` : "" : ""}
                                    </Typography>
                                </Box>
                            </Box>

                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', mt: 2 }}>
                            {auth?.authRole[0] === 'dean' && <Button variant="contained" color="primary" sx={{ width: "300px" }} disabled={snackbar.open}>Submit Consent Letter</Button>}
                            {
                                (auth?.authRole[0] === 'qac_officer' || auth?.authRole[0] === 'qac_director' || auth?.authRole[0] === 'reviewer') && pgpr?.statusOfPgpr !== 'PLANNING' ?
                                    <Button variant="contained" color="primary" sx={{ width: "300px" }} component={Link} to={`/${auth.authRole[0]}/pgprs/${pgprId}/ser/${pgpr?.selfEvaluationReport?.id}`} disabled={snackbar.open}>
                                        View Self Evaluation Report
                                    </Button>
                                    :
                                    (auth?.authRole[0] === 'qac_officer' || auth?.authRole[0] === 'qac_director' || auth?.authRole[0] === 'reviewer') ?
                                        <Typography variant="h6" color='Highlight'>
                                            You cannot view the Self Evaluation Report until the Planning Stage is completed
                                        </Typography>
                                        :
                                        (auth?.authRole[0] === 'cqa_director' || auth?.authRole[0] === 'dean' || auth?.authRole[0] === 'vice_chancellor' || auth?.authRole[0] === 'iqau_director' || auth?.authRole[0] === 'programme_coordinator') ?
                                            <Button variant="contained" color="primary" sx={{ width: "300px" }} component={Link} to={`/${auth.authRole[0]}/pgprs/${pgprId}/ser/${pgpr?.selfEvaluationReport?.id}`} disabled={snackbar.open}>
                                                View Self Evaluation Report
                                            </Button>
                                            : null
                            }
                        </Box>
                    </Box>
            }
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='lg'>
                <DialogTitle textAlign={'center'}>Reviewers</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Name</TableCell>
                                    <TableCell align='center'>Working Faculty</TableCell>
                                    <TableCell align='center'>University</TableCell>
                                    <TableCell align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewers?.map((reviewer) => (
                                    <TableRow key={reviewer?.userData?.id}>
                                        <TableCell align='center'>{reviewer?.userData?.initials} {reviewer?.userData?.surname}</TableCell>
                                        <TableCell align='center'>{reviewer?.faculty.name}</TableCell>
                                        <TableCell align='center'>{reviewer?.faculty.university.name}</TableCell>
                                        <TableCell align='center'>
                                            <ButtonGroup>
                                                <Button size='small' sx={{ mb: 1 }} color="primary" onClick={() => {
                                                    setReviewerChair(reviewer);
                                                    handleClose();
                                                }}>Select as Chair</Button>
                                                <Button size='small' sx={{ mb: 1 }} color="primary" onClick={() => {
                                                    setReviewer1(reviewer);
                                                    handleClose();
                                                }}>Select as Member 1</Button>
                                                <Button size='small' sx={{ mb: 1 }} color="primary" onClick={() => {
                                                    setReviewer2(reviewer);
                                                    handleClose();
                                                }}>Select as Member 2</Button>
                                            </ButtonGroup>
                                            <br />
                                            <Button color='success' size='small' sx={{ mb: 1 }} component={Link} to={`/${auth.authRole[0]}/reviewers/${reviewer.userData.id}`}>
                                                View Profile
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open2} onClose={handleClose} fullWidth maxWidth='lg'>
                <DialogTitle textAlign={'center'}>Postgraduate Programme Reviews</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>PGPR-ID</TableCell>
                                    <TableCell align='center'>Postgraduate Programme</TableCell>
                                    <TableCell align='center'>Faculty</TableCell>
                                    <TableCell align='center'>University</TableCell>
                                    <TableCell align='center'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pgprs?.map((pgpr) => {
                                    if(pgpr?.id == pgprId) return null;
                                    return (
                                        <TableRow key={pgpr?.id}>
                                            <TableCell align='center'>{pgpr?.id}</TableCell>
                                            <TableCell align='center'>{pgpr?.postGraduateProgramme?.title}</TableCell>
                                            <TableCell align='center'>{pgpr?.postGraduateProgramme?.faculty.name}</TableCell>
                                            <TableCell align='center'>{pgpr?.postGraduateProgramme?.faculty.university.name}</TableCell>
                                            <TableCell align='center'>
                                                <Button variant="contained" onClick={()=> handleGrouping(pgpr?.id)}>
                                                    Group with this PGPR
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    )
}

export default ViewPGPR