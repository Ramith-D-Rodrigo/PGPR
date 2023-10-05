import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import ScrollableDiv from '../../components/ScrollableDiv';
import { styled } from '@mui/material/styles';
import { CircularProgress, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSetUserNavigations from '../../hooks/useSetUserNavigations'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Link as ExternalLink } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../../api/api.js';
import useAuth from "../../hooks/useAuth.js";
import getCQADirectorUniversity from "../../api/CQADirector/getCQADirectorUniversity.js";
import getUniversityFaculties from "../../api/University/getUniversityFaculties.js";
import getViceChancellorUniversity from "../../api/ViceChancellor/getViceChancellorUniversity.js";
import getAllFaculties from "../../api/Faculty/getAllFaculties.js";

function Faculties() {
    useSetUserNavigations(
        [
            {
                name: "Faculties",
                link: "/faculties"
            },
        ]
    );

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);

    const { auth } = useAuth();

    useEffect(() => {
        document.title = "Faculties";

        async function getFaculties() {
            setLoading(true);

            //this faculties page is generally for all users, but based on the role of the user, we have to show different data
            //CQA Director can see all faculties of his university
            //Vice Chancellor can see all faculties of his university
            //QAC Director and QAC Officer can view all faculties of the system

            //others cannot view page

            const userRole = auth?.authRole[0];

            try {
                if (userRole === 'cqa_director') {
                    //first get the university of the cqa director
                    const cqaUniResponse = await getCQADirectorUniversity(auth?.id);
                    if (cqaUniResponse?.status === 200) {

                        //then get the faculties of that university
                        const cqaUniId = cqaUniResponse?.data?.data?.id;

                        const cqaUniFacultiesResponse = await getUniversityFaculties(cqaUniId);

                        if (cqaUniFacultiesResponse?.status === 200) {
                            setFaculties(cqaUniFacultiesResponse?.data?.data);
                        }
                    }
                }
                else if (userRole === 'vice_chancellor') {
                    //first get the university of the vice chancellor
                    const vcUniResponse = await getViceChancellorUniversity(auth?.id);
                    if (vcUniResponse?.status === 200) {

                        //then get the faculties of that university
                        const vcUniId = vcUniResponse?.data?.data?.id;

                        const vcUniFacultiesResponse = await getUniversityFaculties(vcUniId);

                        if (vcUniFacultiesResponse?.status === 200) {
                            setFaculties(vcUniFacultiesResponse?.data?.data);
                        }
                    }
                }
                else if (userRole === 'qac_director' || userRole === 'qac_officer') {
                    //get all faculties of the system
                    const facultyResponse = await getAllFaculties({ includeUniversity: true });
                    if (facultyResponse?.status === 200) {
                        setFaculties(facultyResponse?.data?.data);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }

            setLoading(false);
        }

        getFaculties();
    }, [auth]);

    const rows = faculties.map((faculty) => {
        let rowData = {};
        rowData = {
            name: faculty.name,
            website: <ExternalLink style={{ color: "darkblue" }} href={faculty.website} target="_blank" rel="noopener">{faculty.website}</ExternalLink>,
            address: faculty.address,
            Actions: <Button variant="contained" style={{ boxShadow: '2px 3px 8px 1px #888888' }}><Link to={`${faculty.id}`}>View</Link></Button>
        }

        if (auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director') {
            rowData.university = [faculty.university.id, faculty.university.name];
        }

        return rowData;
    });

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
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
            }}>
                {auth?.authRole[0] === 'cqa_director' &&
                    <Link to="add">
                        <Button variant="contained" style={{ margin: "2rem 0 0", boxShadow: '2px 3px 8px 1px #888888' }}>Add Faculty</Button>
                    </Link>
                }
            </Box>

            <TableContainer style={{ margin: "1rem 0" }} component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: "#D8E6FC", }}>
                        <TableRow>
                            <TableCell><b>Faculty Name</b></TableCell>
                            <TableCell align="center"><b>Faculty Official Website</b></TableCell>
                            {auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' &&
                                <TableCell align="center"><b>Belonging University</b></TableCell>
                            }
                            <TableCell align="center"><b>Address</b></TableCell>
                            <TableCell align="center"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.website}</TableCell>
                                {auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                                    <TableCell align="center">{row.university[1]}</TableCell>
                                    :
                                    null
                                }
                                <TableCell align="center">{row.address}</TableCell>
                                <TableCell align="center">{row.Actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {rows.length == 0 &&
                <Typography align='center' variant="body1" gutterBottom component="div" style={{ marginRight: '20px' }}>
                    No Data Found
                </Typography>
            }

        </>
    );
}

export default Faculties