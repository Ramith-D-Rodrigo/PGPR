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

const ConductDE = () => {
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState({});
    const [loading,SetLoading] = useState(false);

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

    function createData(criteriaData,submitted_standards, y1,y2,y3,y4,y5) {
        const Actions = [<Link key={1} to={`${criteriaData.id}`}><Button style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{"Evaluate"}</Button></Link>]
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

    const headerInfo = [
        { label: "University:", value: "University of Colombo" },
        {
          label: "Faculty/Institute:",
          value: "University of Colombo School of Computing",
        },
        { label: "PGPR ID:", value: pgprId },
        { label: "PGPR Name:", value: "MSc" },
        { label: "Application Start Date:", value: "12/12/2020" },
        { label: "Submission Date:", value: "01/01/2021" },
        { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
      ];

      const Criterias = SERDetails?.criterias;
      const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

      console.log("Criterias : ",Criterias);
        console.log("evidencesForGivenStandards : ",evidencesForGivenStandards);
  
      const rows = Criterias? createSERRows(SERDetails?.criterias,SERDetails?.evidenceGivenStandards,createData) : [];

    //   const rows = [
    //     createData("Programme Management",'X1/27', "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("P. Design and Development",'X1/27', "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("Human Physical Res. & LS",'X1/27', "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("Teaching Learning Research",'X1/27', "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("Programme Evaluation","X1/27", "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("Student Assessment & Awards","X1/27", "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //     createData("Innovative & Healthy Practices","X1/27", "x11","x12","x12", 'x12','x12', [{action:'Evaluate',allow:true}]),
    //   ];

    return (
        <>
            {/* <DiscriptiveDiv onClick={handleClick} expand={expand==8? 1:2} description="Reviewer" width='100%' height={`${expand}%`} backgroundColor="#D9D9D9" >
                <Box sx={{ 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' 
                }}>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>University :</div><div style={headerRowDivStyle}>University of Colombo</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>Faculty/Institute :</div><div style={headerRowDivStyle}>University of Colombo School of Computing</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>PGPR ID :</div><div style={headerRowDivStyle}>{pgprId}</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>PGPR Name :</div><div style={headerRowDivStyle}>MSc</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>Application Start Date :</div><div style={headerRowDivStyle}>12/12/2020</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>Submission Date :</div><div style={headerRowDivStyle}>01/01/2021</div></Box>
                    <Box style={headerRowStyle}><div style={headerRowDivStyle}>Program Coordinator :</div><div style={headerRowDivStyle}>Mr. Smantha Karunanayake</div></Box>
                </Box>
            </DiscriptiveDiv> */}
            <DiscriptiveDiv
                description="chair Reviewer"
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
                    <Link to = {`../UpdateABC/${pgprId}`}><Button variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>Update Part A, B, D</Button></Link>
                    <Link to = {`../Standardwise_details/${pgprId}`}><Button variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>View Standards Wise Details of Desk Review</Button></Link>
                    <Link to = {`../Summary_details/${pgprId}`}><Button variant="contained" size="small" style={{width:"300px",height:'55px',backgroundColor:"#A2CBEA",color:'black'}}>View Summary Details of Criteria Wise</Button></Link>
            </Box>
        </>
    )
}

export default ConductDE

