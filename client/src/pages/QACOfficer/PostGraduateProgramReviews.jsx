import React from 'react'
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import { useState, useEffect } from 'react';
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
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Post Graduate Program</TableCell>
                            <TableCell>Faculty</TableCell>
                            <TableCell>University</TableCell>
                            <TableCell>Programme Coordinator</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Grouped</TableCell>
                            <TableCell>Application</TableCell>
                            <TableCell>Payment Voucher</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pgprs.map((pgpr) => (
                            <TableRow key={pgpr.id}>
                                <TableCell>PGPR-{pgpr.id}</TableCell>
                                <TableCell>{pgpr.postGraduateProgramme.title}</TableCell>
                                <TableCell>{pgpr.postGraduateProgramme.faculty.name}</TableCell>
                                <TableCell>{pgpr.postGraduateProgramme.faculty.university.name}</TableCell>
                                <TableCell>{pgpr.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.surname 
                                + " " + pgpr.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.initials}</TableCell>
                                <TableCell>{pgpr.statusOfPgpr}</TableCell>
                                <TableCell>{pgpr.groupedWith ? (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        Yes
                                    </Typography>
                                    ) : (
                                    <Typography variant="body2" color="text.secondary" align="center">
                                        No
                                    </Typography>
                                     )}
                                </TableCell>
                                <TableCell>
                                    <Button>
                                        View Application
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    {pgpr.paymentVoucher ?
                                        <Button>
                                            View Payment Voucher
                                        </Button>
                                        :
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            Not Uploaded
                                        </Typography>
                                    }
                                </TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button component={Link} to={'/qac_officer/PGPRs/view/' + pgpr.id}>
                                            View
                                        </Button>
                                        <Button>
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