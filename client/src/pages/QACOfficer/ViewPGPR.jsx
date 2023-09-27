import { Box, Divider } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth'
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Button, Typography,Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewPGPR = () => {
    const { pgprId, serId } = useParams();

    const [pgpr, setPgpr] = useState(null);
    const {auth} = useAuth();

    useEffect(() => {
        const pgprResults = async () => {
            try{
                const pgprResults = await getPGPR(pgprId);

                if(pgprResults.status){
                    setPgpr(pgprResults.data.data);
                    console.log(pgprResults.data.data);
                }
            
            }
            catch(error){
                console.log(error);
            }

        }
        pgprResults();
    }, []);

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

    //we have to get the final report separately

    const secondaryBoxStyle = {display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width:'50%', mt: 2,minHeight:'60vh'};
    const detailedBox = {display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width:'100%', margin:"1rem"};
    const itemBox = {display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',width:'90%', margin:"0.2rem 0"};

    return (
        <>
            <Typography variant="h5" align='center'>
                Details of Post Graduate Program Review
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row', mt: 2,flexWrap:'wrap'}}>
                <Box sx={{...secondaryBoxStyle,borderRight:"1px solid black"}}>

                    <Divider><strong>General Details</strong></Divider>
                    <Box sx={detailedBox}>
                        <Box sx={itemBox}>
                            <Typography variant="h6" align='left'>
                                Postgraduate Programe Review ID
                            </Typography>
                            <Typography variant="h6" align='left'>
                                {"PGPR - "+pgprId}
                            </Typography>
                        </Box>
                        <Box sx={itemBox}>
                            <Typography variant="h6" align='left'>
                                Postgraduate Programe
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
                    </Box>
                </Box>
                <Box sx={{...secondaryBoxStyle,borderLeft:"1px solid black"}}>

                    <Divider><strong>Grouped Details</strong></Divider>
                    <Box sx={detailedBox}>
                        <Box sx={itemBox}>
                            <Typography variant="h6" align='left'>
                                Grouped with
                            </Typography>
                            <Box sx={{width:'50%',display:'flex',justifyContent:'flex-end'}}>
                                {
                                
                                    groupDetails? 
                                    <Box sx={{display:'flex'}}>
                                        {
                                            groupDetails.map((group)=>
                                            {
                                                <Box key={group.id} sx={{display:'flex',alignItems:'center' ,boxShadow: "0px 0px 0px 1px lightgray inset",borderRadius:5,padding:'0.3rem 0.5rem',ml:0.5}}>
                                                    <Typography align='left'>
                                                        {`${group?.id}`}
                                                    </Typography>
                                                    <CloseIcon fontSize='small' sx={{cursor:'pointer',ml:1,':hover':{color:'red'}}}/>
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
                        (auth?.authRole[0] === 'qac_officer' || auth?.authRole[0] === 'qac_director') &&
                        <Box sx={itemBox}>
                            <Typography variant="h6" align='left'>
                                Edit Group
                            </Typography>
                                <Button variant='outlined' size='small' sx={{mb:1}} color="primary">Add a PGPR</Button>
                        </Box>
                        }
                    </Box>

                    <Divider><strong>Review Team & Their Universities</strong></Divider>
                    <Box sx={detailedBox}>
                        <Box sx={itemBox}>
                            <Box align='left'>
                                    <Typography variant="h6" sx={{mb:1}} align='left'>
                                        Chair
                                    </Typography>
                                    <Typography variant="h6" sx={{mb:1}} align='left'>
                                        Reviewer 1
                                    </Typography>
                                    <Typography variant="h6" sx={{mb:1}} align='left'>
                                        Reviewer 2
                                    </Typography>
                            </Box>
                            <Box align='left' sx={{display:'flex',flexDirection:'column'}}>
                                <Button variant='outlined' size='small' sx={{mb:1}} color="primary">Select</Button>
                                <Button variant='outlined' size='small' sx={{mb:1}} color="primary">Select</Button>
                                <Button variant='outlined' size='small' sx={{mb:1}} color="primary">Select</Button>
                            </Box>
                            <Box align='left'>
                                {reviewTeam?.map((reviewer) => (
                                    <Typography key={reviewer?.userData?.id}variant="h6" sx={{mb:1}} align='left'>
                                        {reviewer?.userData?.initials+ " " + reviewer?.userData?.surname}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    <Divider><strong>Evaluations</strong></Divider>
                    <Box sx={detailedBox}>
                        <Box sx={{...itemBox,flexWrap:'wrap'}}>
                            
                            <Typography variant="h6" align='left'>
                                Desk Evaluation
                            </Typography>
                            <Typography variant="body" align='left'>
                                {deskEvaluation? deskEvaluation?.status : "Not Started"}
                            </Typography>
                            <Typography variant="body" align='left'>
                                {deskEvaluation? deskEvaluation?.startDate? `from ${deskEvaluation?.startDate}` : "" : ""}
                            </Typography>
                            <Typography variant="body" align='left'>
                                {deskEvaluation? deskEvaluation?.endDate? `to ${deskEvaluation?.endDate}` : "" : ""}
                            </Typography>
                        </Box>
                        <Box sx={{...itemBox,flexWrap:'wrap'}}>
                            <Typography variant="h6" align='left'>
                                Proper Evaluation
                            </Typography>
                            <Typography variant="body" align='left'>
                                {properEvaluation? properEvaluation?.status : "Not Started"}
                            </Typography>
                            <Typography variant="body" align='left'>
                                {properEvaluation? properEvaluation.startDate? `from ${properEvaluation?.startDate}` : "" : ""}
                            </Typography>
                            <Typography variant="body" align='left'>
                                {properEvaluation? properEvaluation?.endDate? `to ${properEvaluation?.endDate}` : "" : ""}
                            </Typography>
                        </Box>
                    </Box>

                </Box>

                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-around',width:'100%',mt:2}}>
                    {auth?.authRole[0] === 'dean' && <Button variant="contained" color="primary" sx={{width:"300px"}}>Submit Consent Letter</Button>}
                    <Button variant="contained" color="primary" sx={{width:"300px"}}>View Self Evaluation Report</Button>
                </Box>
            </Box>


            


        
        </>
    )
}

export default ViewPGPR