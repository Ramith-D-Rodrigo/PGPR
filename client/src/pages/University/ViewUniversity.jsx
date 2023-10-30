import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAUniversity from '../../api/University/getAUniversity';
import { Box, Button, Chip, CircularProgress, Divider, MenuItem, Select, Table, Typography } from '@mui/material';
import { SERVER_URL } from '../../assets/constants';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import getCurrentDean from '../../api/Faculty/getCurrentDean';
import useAuth from '../../hooks/useAuth';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const ViewUniversity = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const [university, setUniversity] = useState(null);

    const { auth } = useAuth();

    useSetUserNavigations(
        [{
            name: "Dashboard",
            link: "/"
        },
        {
            name: "Universities",
            link: "/universities"
        },
        {
            name: "View University",
            link: "/universities/view" + id
        },
        ]
    );

    useEffect(() => {

        document.title = 'View University | CQA'

        const handleGetUniversity = async () => {

            setLoading(true);

            try {

                const queryParams = {
                    'includeCQA': true,
                    'includeViceChancellor': true,
                    'includeUniversitySide': true,
                    'includeUser': true,
                }

                console.log(id);
                const result = await getAUniversity(id, queryParams);

                console.log(result.data.data);

                //get faculties of the university
                const facultyResult = await getUniversityFaculties(id);

                console.log(facultyResult.data.data);

                //go through each faculty and get the dean
                for (let i = 0; i < facultyResult.data.data.length; i++) {
                    const faculty = facultyResult.data.data[i];

                    const deanResult = await getCurrentDean(faculty.id, { 'includeUser': true, 'includeUniversitySide': true, 'includeAcademicStaff': true });

                    console.log(deanResult.data.data);

                    faculty.dean = deanResult.data.data;
                }

                result.data.data.faculties = facultyResult.data.data;

                setUniversity(result.data.data);
            }
            catch (err) {
                console.log(err.response.data);
            }

            setLoading(false);
        }

        handleGetUniversity();
    }, [id]);

    const styled = {
        display: 'flex',
        width: '80%',
        margin: '0.6rem',
    }

    return (
        <>
            <Divider textAlign='left' sx={{ mb: 2 }}>
                <Chip label="View University" />
            </Divider>

            {loading &&
                <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                        Loading Data...
                    </Typography>
                    <CircularProgress
                        style={{ margin: "0 0 0 20px", color: "darkblue" }}
                        thickness={5}
                        size={24}
                    />
                </div>
            }
            {!loading && university &&
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                University
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {university.name}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Address
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {university.address}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Contact Numbers
                            </Typography>
                            <Select defaultValue={university.contactNo.data[0]} sx={{ minWidth: '50%' }}>
                                {university.contactNo.data.map((contactNo) => (
                                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Fax Numbers
                            </Typography>
                            <Select defaultValue={university.faxNo.data[0]} sx={{ minWidth: '50%' }}>
                                {university.faxNo.data.map((faxNo) => (
                                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Current Vice Chancellor
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {university.viceChancellor?.universitySide.user.initials + " " + university.viceChancellor?.universitySide.user.surname}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Website
                            </Typography>
                            <Button>
                                <a href={university.website} target="_blank" rel="noreferrer">
                                    View Website
                                </a>
                            </Button>
                        </Box>

                        <Divider sx={{ width: '80%', my:2 }}>
                            <Chip label="Center For Quality Assurance" color='primary'/>
                        </Divider>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Email
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {university.centerForQualityAssurance.email}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Contact Numbers
                            </Typography>
                            <Select defaultValue={university.centerForQualityAssurance.contactNo[0]} sx={{ minWidth: '50%' }}>
                                {university.centerForQualityAssurance.contactNo.map((contactNo) => (
                                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Fax Numbers
                            </Typography>
                            <Select defaultValue={university.centerForQualityAssurance.faxNo[0]} sx={{ minWidth: '50%' }}>
                                {university.centerForQualityAssurance.faxNo.map((faxNo) => (
                                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Current Center For Quality Assurance Director
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {university.centerForQualityAssurance?.currentCQADirector.qualityAssuranceStaff.universitySide.user.initials + " " + university.centerForQualityAssurance?.currentCQADirector.qualityAssuranceStaff.universitySide.user.surname}
                            </Typography>
                        </Box>

                        <Divider sx={{ width: '80%' , my:2 }}>
                            <Chip label="Faculties" color='primary'/>
                        </Divider>

                        <TableContainer sx={styled}>
                            <Table>
                                <TableHead style={{backgroundColor:"#D8E6FC",}}>
                                    <TableRow>
                                        <TableCell align="center"><strong>Name</strong></TableCell>
                                        <TableCell align="center"><strong>Current Dean</strong></TableCell>
                                        <TableCell align="center"><strong>Website</strong></TableCell>
                                        <TableCell align="center"><strong>Actions</strong></TableCell>
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {university.faculties.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.dean?.academicStaff.universitySide.user.initials + " " + row.dean?.academicStaff.universitySide.user.surname}</TableCell>
                                            <TableCell align="center">
                                                <Button>
                                                    <a href={row.website}>
                                                        View Website
                                                    </a>
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Link to={`faculties/${row.id}`}>
                                                    <Button>View More</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                </>
            }
        </>
    )
}

export default ViewUniversity
