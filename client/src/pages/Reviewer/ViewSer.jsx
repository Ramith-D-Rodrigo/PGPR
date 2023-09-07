import { SERVER_URL, SERVER_API_VERSION } from '../../assets/constants';
import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import useDrawerState from '../../hooks/useDrawerState';
import axios from '../../api/api';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';


const ViewSer = () => {
    const {pgprId} = useParams();
    const open = useDrawerState().drawerState.open;
    const [SERDetails,setSERDetails] = useState({});

    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "View SER",
                link: "/PG_Assignments/ViewSer/"+pgprId
            }
        ]
    );

    useEffect(() => {
        document.title = "View SELF EVALUATION REPORT";
        const getSERDetails = async () => {
            try {
                const response = await getSelfEvaluationReport(pgprId);
                console.log("SER Details : ",response?.data?.data);
                setSERDetails(response?.data?.data);
            } catch (err) {
                console.error(err);
            }
        };
        getSERDetails();
    }, []);

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);

    let bodyHeight = open ==true? `${90-expand}%` : `calc( ${90-expand}% - 60px )`;
    const handleClick = ()=>{
        if(expand==8)
        {
        setexpand(descriptionWidth);
        }
        else{
        setexpand(8);
        }
    };
    let tableHeight = expand ==8? {} : {height:'300px'};

    function createData(criteria,submitted_standards, y1,y2,y3,y4,y5) {
        
        return {criteria, submitted_standards, y1,y2,y3,y4,y5};
    }

    const headerRowStyle = {
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', padding: '0 20px', fontSize: '16px',borderBottom: '1px solid #00000020'
    };

    const headerRowDivStyle = {width:'50%',textAlign:'left'};

    const pgProgrammeDetails = SERDetails?.postGraduateProgramReview?.postGraduateProgramme;
    const facultyDetails = pgProgrammeDetails?.faculty;
    const universityDetails = facultyDetails?.university;
    const pgCoordinatorDetails = pgProgrammeDetails?.programmeCoordinator?.academicStaff?.universitySide?.user;

    const headerInfo = [
        { label: "University:", value: universityDetails?.name },
        {
          label: "Faculty/Institute:",
          value: facultyDetails?.name,
        },
        { label: "PGPR ID:", value: `PGPR-${pgprId}` },
        { label: "PG programme Name:", value: pgProgrammeDetails?.title },
        { label: "Application Start Date:", value: "12/12/2020" },
        { label: "Submission Date:", value: "01/01/2021" },
        { label: "Program Coordinator:", value: `${pgCoordinatorDetails?.initials} ${pgCoordinatorDetails?.surname}` },
      ];

    const Criterias = SERDetails?.criterias;
    const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

    const createRows = () => {
        const rows = Criterias?.map((criteria,index)=>{
            let noOfStandards = criteria?.standards?.length;
            let noOfSubmittedStandards = 0;
            let evidencesCount = [0,0,0,0,0,0]; // 1:Y1, 2:Y2, 3:Y3, 4:Y4, 5:Y5
            criteria?.standards?.forEach((standard,index)=>{
                let standardId = standard?.id;
                evidencesForGivenStandards?.forEach((givenStandard,index)=>{
                    if(givenStandard?.id == standardId)
                    {
                        noOfSubmittedStandards++;
                        const evidences = givenStandard?.evidences;
                        evidences?.forEach((evidence,index)=>{
                            const applicableYears = evidence?.applicableYears;
                            applicableYears?.forEach((year,index)=>{
                                evidencesCount[year]++;
                            });
                        });
                        return;
                    }
                });
            });
            return createData(criteria?.name,`${noOfSubmittedStandards}/${noOfStandards}`, evidencesCount[1],evidencesCount[2],evidencesCount[3],evidencesCount[4],evidencesCount[5]);
        });
        return rows;
    };

    const rows = Criterias? createRows() : [];


    // const rows = [
    //     createData("Programme Management",'X1/27', "x11","x12","x12", 'x12','x12'),
    //     createData("P. Design and Development",'X1/27', "x11","x12","x12", 'x12','x12'),
    //     createData("Human Physical Res. & LS",'X1/27', "x11","x12","x12", 'x12','x12'),
    //     createData("Teaching Learning Research",'X1/27', "x11","x12","x12", 'x12','x12'),
    //     createData("Programme Evaluation","X1/27", "x11","x12","x12", 'x12','x12'),
    //     createData("Student Assessment & Awards","X1/27", "x11","x12","x12", 'x12','x12'),
    //     createData("Innovative & Healthy Practices","X1/27", "x11","x12","x12", 'x12','x12'),
    //   ];

    return (
        <>
            <DiscriptiveDiv
                description="Reviewer"
                width="100%"
                height="auto"
                backgroundColor="#D8E6FC"
                sx={{marginBottom:'20px'}}
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
            <Typography align='center' fontWeight={600} variant="h6" gutterBottom component="div" style={{marginRight:'20px'}}>
                View Self Evaluation Report
            </Typography>
            <TableContainer component={Paper} style={{height:"auto",margin:"2rem 0"}}>
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Submitted Standards</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Evidences</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y1</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y2</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y3</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y4</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Y5</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default ViewSer
