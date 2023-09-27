import React from 'react'
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import { useState, useEffect } from 'react';
import {CircularProgress} from '@mui/material';
import Paper from '@mui/material/Paper';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell, ButtonGroup } from '@mui/material';
import { Button } from '@mui/material';
import {Typography} from '@mui/material';
import { Link } from 'react-router-dom';
import ViewPGPR from './ViewPGPR';

const PostGraduateProgramReviews = () => {

    const [pgprs, setPgprs] = useState([]);

    useEffect(() => {
        const pgprResults = async () => {
            try{
                const pgprResults = await getAllPGPRs();
                setPgprs(pgprResults.data.data);
                console.log(pgprResults.data.data);

            }
            catch(error){
                console.log(error);
            }
        }
        pgprResults();
    }, []);


    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{backgroundColor:"#D8E6FC",}}>
                        <TableRow>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Post Graduate Program</strong></TableCell>
                            <TableCell><strong>Faculty</strong></TableCell>
                            <TableCell><strong>University</strong></TableCell>
                            <TableCell><strong>Programme Coordinator</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Grouped</strong></TableCell>
                            <TableCell><strong>Application</strong></TableCell>
                            <TableCell><strong>Payment Voucher</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pgprs.map((pgpr) => (
                            <TableRow key={pgpr.id}>
                                <TableCell align='center'>PGPR-{pgpr.id}</TableCell>
                                <TableCell align='center'>{pgpr.postGraduateProgramme.title}</TableCell>
                                <TableCell align='center'>{pgpr.postGraduateProgramme.faculty.name}</TableCell>
                                <TableCell align='center'>{pgpr.postGraduateProgramme.faculty.university.name}</TableCell>
                                <TableCell align='center'>{pgpr.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.surname 
                                + " " + pgpr.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.initials}</TableCell>
                                <TableCell align='center'>{pgpr.statusOfPgpr}</TableCell>
                                <TableCell align='center'>{pgpr.groupedWith ? (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Yes
                                    </Typography>
                                    ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No
                                    </Typography>
                                     )}
                                </TableCell>
                                <TableCell align='center'>
                                    <Button>
                                        Application
                                    </Button>
                                </TableCell>
                                <TableCell align='center'>
                                    {pgpr.paymentVoucher ?
                                        <Button>
                                            Payment Voucher
                                        </Button>
                                        :
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Not Uploaded
                                        </Typography>
                                    }
                                </TableCell>
                                <TableCell align='center'>
                                    <ButtonGroup>
                                        <Button sx={{margin:"0 0.2rem"}} variant='contained' component={Link} to={'/qac_officer/PGPRs/view/' + pgpr.id}>
                                            View
                                        </Button>
                                        <Button sx={{margin:"0 0.2rem"}} variant='contained'>
                                            Edit
                                        </Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        
        </>
    )
}

export default PostGraduateProgramReviews