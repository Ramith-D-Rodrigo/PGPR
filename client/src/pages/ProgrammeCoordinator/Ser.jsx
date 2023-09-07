import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptionDiv from '../../components/DiscriptionDiv';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import useDrawerState from '../../hooks/useDrawerState';
import ViewSummary from '../../components/ViewSummary';
import { Link } from 'react-router-dom';


const Ser = () => {
    const { uniId } = useParams();
    const open = useDrawerState().drawerState.open;

    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "Self Evaluation Report",
                link: "/PG_Assignments/Ser/"+uniId
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

    const headerInfo = [
        { label: "University:", value: "University of Colombo" },
        {
          label: "Faculty/Institute:",
          value: "University of Colombo School of Computing",
        },
        { label: "PGPR ID:", value: uniId },
        { label: "PGPR Name:", value: "MSc" },
        { label: "Application Start Date:", value: "12/12/2020" },
        { label: "Submission Date:", value: "01/01/2021" },
        { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
      ];

    const rows = [
        createData("Programme Management",'X1/27', "x11","x12","x12", 'x12','x12'),
        createData("P. Design and Development",'X1/27', "x11","x12","x12", 'x12','x12'),
        createData("Human Physical Res. & LS",'X1/27', "x11","x12","x12", 'x12','x12'),
        createData("Teaching Learning Research",'X1/27', "x11","x12","x12", 'x12','x12'),
        createData("Programme Evaluation","X1/27", "x11","x12","x12", 'x12','x12'),
        createData("Student Assessment & Awards","X1/27", "x11","x12","x12", 'x12','x12'),
        createData("Innovative & Healthy Practices","X1/27", "x11","x12","x12", 'x12','x12'),
      ];

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
                <Link to={`/edit-ser/${uniId}`}>
                <Button variant="contained" color="info" size="small">
                    Edit
                </Button>
                </Link>
                <Button variant="contained" color="error" size="small">
                    Delete
                </Button>
            </div>
        );
    };
    
    rows.forEach((row) => {
        row.Actions = renderActions();
    });

    return (
        <>
            <DiscriptionDiv
                
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
            </DiscriptionDiv>
            
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
                                {rows.map((row) => (
                                <TableRow key={row.criteria} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{row.criteria}</TableCell>
                                <TableCell align="center">{row.submitted_standards}</TableCell>
                                <TableCell align="center">{row.y1}</TableCell>
                                <TableCell align="center">{row.y2}</TableCell>
                                <TableCell align="center">{row.y3}</TableCell>
                                <TableCell align="center">{row.y4}</TableCell>
                                <TableCell align="center">{row.y5}</TableCell>
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

export default Ser
