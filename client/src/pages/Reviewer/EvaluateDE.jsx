import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Link } from 'react-router-dom';
import useDrawerState from '../../hooks/useDrawerState';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';
import getAllCriteria from '../../api/Criteria/getAllCriteria';
import getStandardEvidencesAndAdherenceForSER from '../../api/SelfEvaluationReport/getStandardEvidencesAndAdherenceForSER';
import { SERVER_URL, SERVER_API_VERSION } from '../../assets/constants';
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';
import getDeEvaluationResults from '../../api/Reviewer/getDeEvaluationResults';
import conductDeskEvaluation from '../../api/Reviewer/conductDeskEvaluation';
import ReplayIcon from '@mui/icons-material/Replay';

const EvaluateDE = () => {
    const {pgprId,criteriaId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [standardID, setstandardID] = useState(1);
    const [previousObservations, setpreviousObservations] = useState('');
    const [previousScore, setpreviousScore] = useState(0);
    const [observations, setobservations] = useState('');
    const [score, setscore] = useState(0);
    const [observationsErrMsg,setobservationsErrMsg ]= useState("");
    const [scoreErrMsg,setscoreErrMsg] = useState("");
    const [SERDetails,setSERDetails] = useState([]);
    const [PGPRDetails,setPGPRDetails] = useState([]);
    const [deskEvaluation,setDeskEvaluation] = useState([]);
    const [Standard,setStandard] = useState([]);
    const [evidencesForSelectedStandard,setevidencesForSelectedStandard] = useState([]);
    const [criterias,setCriterias] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        document.title = "View SELF EVALUATION REPORT";
        const getSERDetails = async () => {
            setLoading(true);
            try {
                const response0 = await getSpecificPGPR(pgprId);
                setPGPRDetails(response0?.data);
                console.log("PGPR Details : ",response0?.data);
                setDeskEvaluation(response0?.data?.data?.postGraduateReviewProgram?.deskEvaluation);
                const response1 = await getSelfEvaluationReport(response0?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
                setSERDetails(response1?.data?.data);
                const selectedStandards = response1?.data?.data?.criterias.find((criteria)=>{ return criteria.id==criteriaId}).standards;
                setStandard(selectedStandards);
                await getDataForSelectedStandard(response0?.data?.data?.postGraduateReviewProgram?.deskEvaluation?.id,selectedStandards[standardID-1].id)
                // setevidencesForSelectedStandard(response1?.data?.data?.evidenceGivenStandards.find((evidenceGivenStandard)=>{ return evidenceGivenStandard.standardAdherence.standardId==Standard[standardID-1]?.id}));
                // console.log("SER Details : ",response1?.data?.data);
                const response = await getAllCriteria();
                // console.log("Criterias : ",response?.data?.data);
                setCriterias(response?.data?.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        getSERDetails();
    }, []);

    const getStandardEvidencesAndAdherence = async (standardId) => {
        try {
            setLoading(true);
            const response = await getStandardEvidencesAndAdherenceForSER(pgprId,standardId);
            setevidencesForSelectedStandard(response?.data?.data);
            // console.log("Standard Evidences And Adherence For SER : ",response?.data?.data);
            setLoading(false);
            return response?.data?.data;
        } catch (err) {
            console.error(err);
            setLoading(false);
            return [];
        }
    };

    const getDeEvaluationResultsforStandard = async (deskEvaluationId,standardId) => {
        try {
            setLoading(true);
            const response = await getDeEvaluationResults(deskEvaluationId,criteriaId,standardId);
            setpreviousObservations(response?.data?.data?.comment?? '');
            setpreviousScore(response?.data?.data?.score?? 0);
            setobservations(response?.data?.data?.comment?? '');
            setscore(response?.data?.data?.score?? 0);
            setLoading(false);
            return response?.data?.data;
        } catch (err) {
            console.error(err);
            setLoading(false);
            return [];
        }
    };

    const getDataForSelectedStandard = async (deskEvaluationId,standardId) => {
        //get standard details/ data from endpoint
        if( !standardId || !deskEvaluationId )
        {
            console.log("hello",standardID,deskEvaluationId);
            return;
        }
        getStandardEvidencesAndAdherence(standardId);
        getDeEvaluationResultsforStandard(deskEvaluationId,standardId);
    };


    useEffect(() => {
        getDataForSelectedStandard(deskEvaluation?.id,Standard[standardID-1]?.id);
    }, [standardID]);

    let noOfAllStandards = Standard.length;
    let nextButtonState = standardID==noOfAllStandards? {disabled:true} : {};
    let prevButtonState = standardID==1? {disabled:true} : {};

    // const Criterias = SERDetails?.criterias;
    // console.log("Criterias : ",Criterias);
    // console.log("evidenceForSelectedStandards : ",evidencesForSelectedStandard);

    const findCriteriaName = (criteriaId)=>{
        let criteria = criterias.find((criteria)=>{ return criteria.id==criteriaId});
        return criteria?.name;
    };

    const handleClickNext = ()=>{
        if(observations != previousObservations || score != previousScore)
        {
            alert("Please save the data before proceeding");
            return;
        }
        if(standardID<noOfAllStandards)
        {
            setstandardID(standardID+1);
        }
    };

    const handleClickPrev = ()=>{
        if(observations != previousObservations || score != previousScore)
        {
            alert("Please save the data before proceeding");
            return;
        }
        if(standardID>1)
        {
            setstandardID(standardID-1);
        }
    };

    const handleClickSave = ()=>{

        if(observations=='' || score<0 || score>3)
        {
            alert("Please fill the form correctly");
            return;
        }
        //save data to endpoint
        const save = async () => {
            setLoading(true);
            try {
                const response = await conductDeskEvaluation(pgprId,criteriaId,Standard[standardID-1]?.id,observations,score);
                console.log("Save Response : ",response);
                getDeEvaluationResultsforStandard(deskEvaluation.id,Standard[standardID-1]?.id);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
        save();
    };

    const handleClickCancel = ()=>{
        if(observations != previousObservations || score != previousScore)
        {
            alert("Please save the data before proceeding");
            return;
        }
        //go back
        history.back();

    };

    const handleChangeObservations = (event)=>{
        let max =500;
        let value = event.target.value;
        if(value.length>max)
        {
            setobservationsErrMsg(`maximum length is ${max}`);
        }
        else{
            setobservationsErrMsg('');
            setobservations(value);
        }
        
    };

    const handleChangeScore = (event)=>{
        let value = event.target.value;
        if(value<0)
        {
            setscoreErrMsg("Score shouldn't be less than zero");
        }
        else if(value > 3)
        {
            setscoreErrMsg("Score shouldn't be greater than 4");
        }
        else{
            setscoreErrMsg("");
            setscore(value);
        }
        
    };

    const handleClickRestore = (event)=>{
        setobservations(previousObservations);
        setscore(previousScore);
    };

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
                name: "Evaluate DE",
                link: "/PG_Assignments/Conduct_DE/"+pgprId+"/"+criteriaId
            }
        ]
    );

    const createData = (evidences, yearsapplicable) =>
    {
        const TextNotIncluded = <Typography style={{margin:"8px 0"}} variant="body2" component="div" sx={{ flexGrow: 1 }}> NOT INCLUDED </Typography>
        if(evidences==undefined || yearsapplicable==undefined)
        {
            return {evidences:TextNotIncluded, yearsapplicable:TextNotIncluded};
        }
        evidences = evidences.length == 0? TextNotIncluded : 
            evidences.map((evidence,index) => {
                return <Typography style={{margin:"8px 0"}} key={index} variant="body2" component="div" sx={{ flexGrow: 1 }}>{evidence.id} : <Link style={{}} key={index} to={evidence.link}><b>Evidence</b></Link></Typography>
            });
        yearsapplicable = yearsapplicable.length==0? TextNotIncluded : yearsapplicable.map((years,index) => {
            return <Typography style={{margin:"8px 0"}} key={index} variant="body2" component="div" sx={{ flexGrow: 1 }}>{years}</Typography>
        });
        return {evidences, yearsapplicable};
    }


    const rows = evidencesForSelectedStandard ==[]? [] : [
        // createData([{id:'1.3.01',link:'/1.3.01'},{id:'1.3.02',link:'/1.3.02'}],[['y1','y2'],['y2','y3']]),
        // createData(evidencesForSelectedStandard?.evidences?.map((evidence)=>{ return {id:evidence.id,link:evidence.id} }),['y1,y2','y2,y3']),
        createData(evidencesForSelectedStandard?.evidences?.map((evidence)=>{ return {id:evidence.id,link:evidence.url} }),evidencesForSelectedStandard?.evidences?.map((evidence)=>{ return evidence?.applicableYears?.map((year) => {return `Y${year} `}) } )),
      ];

  return (
    <>
    <DiscriptiveDiv description="Desk Evaluation"  width='100%' height="80%" backgroundColor="white" >
        {loading &&
                    <div style={{position:'absolute',left:0,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center"}}> 
                        <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                            Loading ...
                        </Typography>
                        <CircularProgress
                        style={{ margin: "0 0 0 20px", color: "darkblue" }}
                        thickness={5}
                        size={24}
                        />
                    </div>
        }

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Criteria : {findCriteriaName(criteriaId)} - {`PGPR-${pgprId}`}
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Standard {standardID} / {noOfAllStandards}
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {Standard[standardID-1]?.standardNo}
        </Typography>

        <TableContainer component={Paper} style={{margin:"2rem 0"}}>
            <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b># Standard</b></TableCell>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>University Adherence to the standard</b></TableCell>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Documentary Evidences</b></TableCell>
                        <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Years Applicable</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    
                    {rows.map((row,index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="left"><Box sx={{maxWidth:'25rem'}}>{Standard[standardID-1]?.description}</Box></TableCell>
                            <TableCell align="center">{evidencesForSelectedStandard?.standardAdherence?.adherence?? 'NOT INCLUDED'}</TableCell>
                            <TableCell align="center">{row.evidences}</TableCell>
                            <TableCell align="center">{row.yearsapplicable}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Box sx={{display:"flex",justifyContent:"space-between",alignItems:'flex-start',width:"100%",margin:"20px 0 0"}}>
            <FormControl {...(observationsErrMsg!=''? {error:true} : {})} style={{width:"50%"}} variant="standard">
                <TextField
                id="observations"
                label="Observations"
                value={observations}
                onChange={(e)=>{handleChangeObservations(e)}}
                multiline
                rows={4}
                />
                <FormHelperText id="component-error-text">{observationsErrMsg}</FormHelperText>
            </FormControl>

            <FormControl {...(scoreErrMsg!=""? {error:true} : {})} style={{width:"40%"}} variant='standard'>
                <TextField
                id="observations"
                label="Score"
                value={score}
                onChange={(e)=>{handleChangeScore(e)}}
                placeholder='0-3'
                type='number'
                rows={4}
                />
                <FormHelperText id="component-error-text">{scoreErrMsg}</FormHelperText>
            </FormControl>
        </Box>
    </DiscriptiveDiv>
    <Box sx={{display:"flex",justifyContent:"space-between",width:"100%",margin:"10px 0"}}>
        <Button {...{disabled:loading}} {...prevButtonState} onClick={handleClickPrev} variant="contained" color="primary" style={{width:"200px"}}>Previous Standard</Button>
        <Button {...{disabled:loading}} onClick={handleClickSave} variant="contained" color="secondary" style={{width:"100px"}}>Save</Button>
        <Button {...{disabled:loading}} onClick={handleClickCancel} variant="contained" color="secondary" style={{width:"100px"}}>Cancel</Button>
        {
           observations != previousObservations? <Button {...{disabled:loading}} onClick={handleClickRestore} variant="outlined" color="secondary" style={{width:"100px"}}>Restore</Button> : ''
        }
        <Button {...{disabled:loading}} {...nextButtonState} onClick={handleClickNext} variant="contained" color="primary" style={{width:"200px"}}>Next Standard</Button>
    </Box>
    </>
  )
}

export default EvaluateDE
