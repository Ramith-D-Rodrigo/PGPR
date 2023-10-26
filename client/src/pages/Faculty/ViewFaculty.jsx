import useAuth from "../../hooks/useAuth.js";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAFaculty from "../../api/Faculty/getAFaculty.js";
import getCurrentDean from "../../api/Faculty/getCurrentDean.js";
import getCurrentIQAUDirector from "../../api/Faculty/getCurrentIQAUDirector.js";
import { Avatar, Button, Divider, TableContainer, Typography } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SERVER_URL } from "../../assets/constants.js";
import { Link } from "react-router-dom";
import getFacultyPostGraduatePrograms from "../../api/Faculty/getFacultyPostGraduatePrograms.js";
import { Paper } from "@mui/material";
import { Table } from "@mui/material";
import { TableBody } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import Box from '@mui/material/Box';


const ViewFaculty = () => {
    const { auth } = useAuth();
    const { facultyId } = useParams();

    const [faculty, setFaculty] = useState(null);

    useEffect(() => {
        document.title = "View Faculty";

        const getFaculty = async () => {
            try {
                //get the faculty
                const queryParams = {
                    includeUniversity: true,
                    includeIQAU: true
                }

                const facultyResponse = await getAFaculty(facultyId, queryParams);

                if (facultyResponse?.status === 200) {
                    const facultyData = facultyResponse?.data?.data;

                    //get faculty current dean

                    const queryParams1 = {
                        includeUser: true,
                        includeAcademicStaff: true,
                        includeUniversitySide: true
                    }
                    const deanResponse = await getCurrentDean(facultyId, queryParams1);

                    if (deanResponse?.status === 200) {
                        facultyData.dean = deanResponse?.data?.data;

                        //get faculty current IQAU director
                        const queryParams2 = {
                            includeUser: true,
                            includeQualityAssuranceStaff: true,
                            includeUniversitySide: true
                        }


                        const iqauDirectorResponse = await getCurrentIQAUDirector(facultyId, queryParams2);

                        if (iqauDirectorResponse?.status === 200) {
                            facultyData.iqauDirector = iqauDirectorResponse?.data?.data;
                        }
                    }

                    //get faculty postgraduate programmes
                    const pgps = await getFacultyPostGraduatePrograms(facultyId);

                    if (pgps?.status === 200) {
                        facultyData.postGraduatePrograms = pgps?.data?.data;
                    }

                    console.log(facultyData);

                    setFaculty(facultyData);
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        getFaculty();
    }, [facultyId]);

    return (
        <>
            <Typography variant="h5" sx={{ mb: 5 }} align='center'>
                Faculty Details
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '50%' }}>
                    {
                        faculty &&
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                <Typography variant="h6">
                                    Name
                                </Typography>
                                <Typography variant="h6">
                                    {faculty.name}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                <Typography variant="h6">
                                    Website
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    to={faculty.website}
                                    target="_blank"
                                >
                                    Visit Website
                                </Button>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                <Typography variant="h6">
                                    Address
                                </Typography>
                                <Typography variant="h6" sx={{ width: '70%' }} align='right'>
                                    {faculty.address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                <Box>
                                    <Select value={'Contact Numbers'}>
                                        <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + 'defaultcontact'} value={'Contact Numbers'}>
                                            Contact Numbers
                                        </MenuItem>
                                        {faculty.contactNo.data.map(contactNo => {
                                            return (
                                                <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + contactNo}>
                                                    {contactNo}
                                                </MenuItem>
                                            )
                                        }

                                        )}
                                    </Select>
                                </Box>

                                <Box>
                                    <Select value={'Fax Numbers'}>
                                        <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + 'defaultfax'} value={'Fax Numbers'}>
                                            Fax Numbers
                                        </MenuItem>
                                        {faculty.faxNo.data.map(faxNo => {
                                            return (
                                                <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + faxNo}>
                                                    {faxNo}
                                                </MenuItem>
                                            )
                                        }

                                        )}
                                    </Select>
                                </Box>
                            </Box>
                        </>
                    }
                </Box>
                <Box sx={{ width: '50%', borderLeft: '1px solid lightgrey' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                        {faculty &&
                            <>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Dean
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        {faculty.dean.academicStaff.universitySide.user.initials + ' ' + faculty.dean.academicStaff.universitySide.user.surname}
                                    </Typography>
                                    <Avatar src={SERVER_URL.slice(0, -1) + faculty.dean.academicStaff.universitySide.user.profilePic} sx={{ ml: 2 }} />
                                    {auth.authRole[0] === 'cqa_director' &&
                                        <>
                                            {/*edit button for Dean*/}
                                            <Button
                                                variant="contained"
                                                sx={{ ml: 2 }}
                                            >
                                                Edit Dean
                                            </Button>

                                        </>
                                    }
                                </Box>
                            </>
                        }
                    </Box>

                    <Divider sx={{ my: 2, width: '95%' }} variant="middle"/>

                    <Typography variant="h6" sx={{ mb: 2 }} align='center'>
                        Internal Quality Assurance Unit
                    </Typography>

                    <Box>
                        {faculty &&
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Address
                                    </Typography>
                                    <Typography variant="h6" sx={{ width: '70%' }} align='right'>
                                        {faculty.internalQualityAssuranceUnit.address}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mx:2 }}>
                                    <Select value={'Contact Numbers'}>
                                        <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + 'defaultcontactiqau'} value={'Contact Numbers'}>
                                            Contact Numbers
                                        </MenuItem>
                                        {faculty.internalQualityAssuranceUnit.contactNo.data.map(contactNo => {
                                            return (
                                                <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + contactNo}>
                                                    {contactNo}
                                                </MenuItem>
                                            )
                                        }

                                        )}
                                    </Select>

                                    <Select value={'Fax Numbers'}>
                                        <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + 'defaultfaxiqau'} value={'Fax Numbers'}>
                                            Fax Numbers
                                        </MenuItem>
                                        {faculty.internalQualityAssuranceUnit.faxNo.data.map(faxNo => {
                                            return (
                                                <MenuItem variant="h6" sx={{ mb: 2 }} key={faculty.id + faxNo}>
                                                    {faxNo}
                                                </MenuItem>
                                            )
                                        }

                                        )}
                                    </Select>
                                </Box>
                            </>
                        }
                    </Box>

                </Box>
            </Box>

            {
                faculty &&
                <>
                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ mb: 2 }} align='center'>
                        Postgraduate Programmes

                    </Typography>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Programme Name</TableCell>
                                    <TableCell>SLQF Level</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {faculty.postGraduatePrograms.map((pgp) => (
                                    <TableRow
                                        key={pgp.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {pgp.title}
                                        </TableCell>
                                        <TableCell>{pgp.slqfLevel}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <Divider sx={{ my: 2 }} />

                    {
                        auth.authRole[0] === 'qac_director' || auth.authRole[0] === 'qac_officer' &&
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            University
                            <Button
                                variant="contained"
                                sx={{ ml: 2 }}
                                component={Link}
                                to={`/${auth.authRole[0]}/universities/${faculty.university.id}`}
                            >
                                View University
                            </Button>
                        </Typography>
                    }


                </>
            }

        </>
    )
}

export default ViewFaculty