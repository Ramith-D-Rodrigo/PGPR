import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import useDrawerState from '../../hooks/useDrawerState';
import ViewSummary from '../../components/ViewSummary';
import { Link } from 'react-router-dom';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';


const Ser = () => {
    const { serId } = useParams();
    
    const open = useDrawerState().drawerState.open;

    const [ser, setSer] = useState({});

    const [isLoaded, setIsLoaded] = useState(false);

    const [headerInfo, setHeaderInfo] = useState([]);

    useEffect(() => {
        const getPGPRData = async () => {
            try {
                const response = await getSelfEvaluationReport(serId);
                if (response && response.status === 200) {
                    setSer(response.data.data);
                    const ser = response.data.data;
                    console.log(response.data.data);

                    setHeaderInfo(
                        [
                            { label: "University:", value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.university.name },
                            {
                              label: "Faculty/Institute:",
                              value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.name,
                            },
                            { label: "PGPR ID:", value: "PGPR-" + ser.postGraduateProgramReview.id },
                            { label: "PGPR Name:", value: ser.postGraduateProgramReview.postGraduateProgramme.title },
                            { label: "Application Start Date:", value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.applicationDate },
                            { label: "Requested Date:", value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.requestDate },
                            { label: "Program Coordinator:", value: 
                            ser.programmeCoordinator.academicStaff.universitySide.user.surname
                            + " " + 
                            ser.programmeCoordinator.academicStaff.universitySide.user.initials },
                        ]);

                    setIsLoaded(true);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getPGPRData();

    }, [serId]);


    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "Self Evaluation Report",
                link: "/PG_Assignments/Ser/"+serId
            }
        ]
    );

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

    function createData(criteria,submitted_standards, y1,y2,y3,y4,y5, Actions) {
        
        return {criteria, submitted_standards, y1,y2,y3,y4,y5, Actions };
    }

    const headerRowStyle = {
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', padding: '0 20px', fontSize: '16px',borderBottom: '1px solid #00000020'
    };

    const headerRowDivStyle = {width:'50%',textAlign:'left'};


    const [isViewSummaryOpen, setViewSummaryOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

      const openViewSummary = (row) => {
        setSelectedRow(row);
        setViewSummaryOpen(true);
      };

      const closeViewSummary = () => {
        setSelectedRow(null);
        setViewSummaryOpen(false);
      };




      const renderActions = (row) => {
        return (
          <div>
                <Button variant="contained" color="primary" size="small" onClick={() => openViewSummary(row)}>
                    View
                </Button>
                <Button variant="contained" color="info" size="small" component={Link} to={"/programme_coordinator/pgprs/"+serId+"/EditSer/" + row.id}>
                    Edit
                </Button>
            </div>
        );
    };
    

    return (
        <>
            <DiscriptiveDiv
                
                width="100%"
                height="auto"
                backgroundColor="#D8E6FC"
                sx={{marginBottom:'20px'}}
            >
                <Grid container spacing={2}>
                {isLoaded && headerInfo.map((infoItem, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                    <Typography align='left' variant="subtitle1">
                        <b>{infoItem.label}</b>
                    </Typography>
                    <Typography align='left'>{infoItem.value}</Typography>
                    </Grid>
                ))}
                </Grid>
            </DiscriptiveDiv>
            
            <TableContainer component={Paper} style={{height:"auto",margin:"2rem 0"}}>
                <Table sx={{ minWidth: 650 }}  aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="left"><b>Criteria</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Submitted Standards</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b>Evidences</b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor:"#D8E6FC",}} align="center"><b></b></TableCell>
                            <TableCell style={{backgroundColor: "#D8E6FC"}} align="center"><b>Actions</b></TableCell>
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
                                {isLoaded && ser.criterias.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{row.id + ". " + row.name}</TableCell>
                                <TableCell align="center">
                                {
                                    row.standards.filter(standard => ser.evidenceGivenStandards.map(evidenceStandard => evidenceStandard.id).includes(standard.id)).length + "/" + row.standards.length
                                }</TableCell>
                                <TableCell align="center">
                                {
                                    ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(1)).length 
                                }
                                </TableCell>
                                <TableCell align="center">
                                {
                                    ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(2)).length 
                                }</TableCell>
                                <TableCell align="center">
                                {
                                    ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(3)).length 
                                }</TableCell>
                                <TableCell align="center">
                                {
                                    ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(4)).length 

                                }</TableCell>
                                <TableCell align="center">
                                {
                                    ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(5)).length 

                                }</TableCell>
                                <TableCell align="center">{renderActions(row)}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <Button variant="contained" color="error" style={{ marginRight: '10px' }}>
                Save and Finish Later
                </Button>
                <Button variant="contained" color="error">
                Submit
               </Button>
            </div>

            <ViewSummary isOpen={isViewSummaryOpen} onClose={closeViewSummary} selectedRow={selectedRow} />
    
        </>
        
    )
}

export default Ser;
