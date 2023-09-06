import React, { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Link } from 'react-router-dom';
import useDrawerState from '../../hooks/useDrawerState';

const EvaluateDE = () => {
    const {pgprId,criteriaId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [standardID, setstandardID] = useState(1);
    const [observations, setobservations] = useState('');
    const [score, setscore] = useState(0);
    const [observationsErrMsg,setobservationsErrMsg ]= useState("");
    const [scoreErrMsg,setscoreErrMsg] = useState("");

    let nextButtonState = standardID==27? {disabled:true} : {disabled:false};
    let prevButtonState = standardID==1? {disabled:true} : {disabled:false};


    let noOfAllStandards = 27;
    useEffect(() => {
        //get all initial (1)standard details/ data from endpoint
    }, []);

    useEffect(() => {
        //get standard details/ data from endpoint
    }, [standardID]);

    const handleClickNext = ()=>{
        if(standardID<noOfAllStandards)
        {
            setstandardID(standardID+1);
        }
    };

    const handleClickPrev = ()=>{
        if(standardID>1)
        {
            setstandardID(standardID-1);
        }
    };

    const handleClickSave = ()=>{
        //save data to endpoint
    };

    const handleClickCancel = ()=>{
        //go back

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
        evidences = evidences.map((evidence,index) => {
            return <Typography style={{margin:"8px 0"}} key={index} variant="body2" component="div" sx={{ flexGrow: 1 }}>{evidence.id} : <Link style={{}} key={index} to={evidence.link}><b>Evidence</b></Link></Typography>
        });
        yearsapplicable = yearsapplicable.map((years,index) => {
            return <Typography style={{margin:"8px 0"}} key={index} variant="body2" component="div" sx={{ flexGrow: 1 }}>{years}</Typography>
        });
        return {evidences, yearsapplicable};
    }


    const rows = [
        createData([{id:'1.3.01',link:'/1.3.01'},{id:'1.3.02',link:'/1.3.02'}],['y1,y2','y2,y3']),
      ];

  return (
    <>
    <DiscriptiveDiv description="Desk Evaluation"  width='100%' height="80%" backgroundColor="white" >

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Criteria : {criteriaId} - {pgprId}
        </Typography>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Standard {standardID} / {noOfAllStandards}
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
                            <TableCell align="left">{"Standard Details"}</TableCell>
                            <TableCell align="center">{"Uni Adherences"}</TableCell>
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
        <Button {...prevButtonState} onClick={handleClickPrev} variant="contained" color="primary" style={{width:"200px"}}>Previous Standard</Button>
        <Button onClick={handleClickSave} variant="contained" color="secondary" style={{width:"100px"}}>Save</Button>
        <Button onClick={handleClickCancel} variant="contained" color="secondary" style={{width:"100px"}}>Cancel</Button>
        <Button {...nextButtonState} onClick={handleClickNext} variant="contained" color="primary" style={{width:"200px"}}>Next Standard</Button>
    </Box>
    </>
  )
}

export default EvaluateDE
