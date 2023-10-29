import useAuth from "../../hooks/useAuth.js";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAFaculty from "../../api/Faculty/getAFaculty.js";
import getCurrentDean from "../../api/Faculty/getCurrentDean.js";
import getCurrentIQAUDirector from "../../api/Faculty/getCurrentIQAUDirector.js";
import { Avatar, Button, Chip, Divider, TableContainer, Typography } from "@mui/material";
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
import useSetUserNavigations from "../../hooks/useSetUserNavigations.js";
import { CircularProgress } from "@mui/material";


const ViewFaculty = () => {
    const { auth } = useAuth();
    const { facultyId } = useParams();
    const [loading, setLoading] = useState(true);

    useSetUserNavigations(
        [
            {
                name: "Dashboard",
                link: "/"
            },
            {
                name: "Faculties",
                link: "/faculties"
            },
            {
                name: "View Faculty",
                link: `/faculties/${facultyId}`
            }
        ]
    );

    const [faculty, setFaculty] = useState(null);

    useEffect(() => {
        document.title = "View Faculty";

        const getFaculty = async () => {
            try {
                setLoading(true);

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

                setLoading(false);
            }
            catch (error) {
                console.log(error);
            }
        }

        getFaculty();
    }, [facultyId]);

    const styled = {
        display: 'flex',
        width: '80%',
        margin: '0.6rem',
    }

    return (
        <>

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
            {!loading && faculty &&
                <>
                    <Divider textAlign="left" sx={{ mb: 2 }}>
                        <Chip label="Faculty Details" />
                    </Divider>

                    <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Faculty
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {faculty.name}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Address
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {faculty.address}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Contact Numbers
                            </Typography>
                            <Select defaultValue={faculty.contactNo.data[0]} sx={{ minWidth: '50%' }}>
                                {faculty.contactNo.data.map((contactNo) => (
                                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Fax Numbers
                            </Typography>
                            <Select defaultValue={faculty.faxNo.data[0]} sx={{ minWidth: '50%' }}>
                                {faculty.faxNo.data.map((faxNo) => (
                                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Current Dean
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {faculty.dean.academicStaff.universitySide.user.initials + " " + faculty.dean.academicStaff.universitySide.user.surname}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Website
                            </Typography>
                            <Button>
                                <a href={faculty.website} target="_blank" rel="noreferrer">
                                    View Website
                                </a>
                            </Button>
                        </Box>

                        <Divider textAlign="center" sx={{ margin: '1rem 0' }}>
                            <Chip label="Internal Quality Assurance Unit" color="primary" />
                        </Divider>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Email
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {faculty.internalQualityAssuranceUnit.email}
                            </Typography>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Contact Numbers
                            </Typography>
                            <Select defaultValue={faculty.internalQualityAssuranceUnit.contactNo.data[0]} sx={{ minWidth: '50%' }}>
                                {faculty.internalQualityAssuranceUnit.contactNo.data.map((contactNo) => (
                                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Fax Numbers
                            </Typography>
                            <Select defaultValue={faculty.internalQualityAssuranceUnit.faxNo.data[0]} sx={{ minWidth: '50%' }}>
                                {faculty.internalQualityAssuranceUnit.faxNo.data.map((faxNo) => (
                                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={styled}>
                            <Typography sx={{ width: '50%' }}>
                                Address
                            </Typography>
                            <Typography sx={{ width: '50%' }}>
                                {faculty.internalQualityAssuranceUnit.address}
                            </Typography>
                        </Box>
                        {
                            faculty &&
                            <>
                                <Divider textAlign="center" sx={{ margin: '1rem 0' }}>
                                    <Chip label="Postgraduate Programmes" color="primary" />
                                </Divider>

                                <TableContainer component={Paper} sx={{ maxWidth: '70%' }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead sx={{ backgroundColor: '#D8E6FC' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Programme Name</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>SLQF Level</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {faculty.postGraduatePrograms.map((pgp) => (
                                                <TableRow
                                                    key={pgp.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" sx={{ textAlign: 'center' }}>
                                                        {pgp.title}
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'center' }}>{pgp.slqfLevel}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>


                                <Divider sx={{ my: 2 }} />

                                {

                                    (auth.authRole[0] == 'qac_director' || auth.authRole[0] == 'qac_officer') &&

                                    <>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            University
                                            <Button
                                                variant="contained"
                                                sx={{ ml: 2 }}
                                                component={Link}
                                                to={`/${auth.authRole[0]}/universities/view/${faculty.university.id}`}
                                            >
                                                View University
                                            </Button>
                                        </Typography>
                                    </>
                                }

                            </>
                        }
                    </Box>
                </>

            }
        </>
    )
}

export default ViewFaculty