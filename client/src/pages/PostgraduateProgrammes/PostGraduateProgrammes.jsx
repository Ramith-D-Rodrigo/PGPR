import getCQADirectorUniversity from '../../api/CQADirector/getCQADirectorUniversity';
import getUniversityPostGraduatePrograms from '../../api/University/getUniversityPostGraduatePrograms';
import getViceChancellorUniversity from '../../api/ViceChancellor/getViceChancellorUniversity';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import getPostGraduateProgramFaculty from '../../api/PostGraduateProgram/getPostGraduateProgramFaculty';
import getDeanFaculty from '../../api/Dean/getDeanFaculty';
import getIQAUDirectorFaculty from '../../api/IQAUDirector/getIQAUDirectorFaculty';
import getFacultyPostGraduatePrograms from '../../api/Faculty/getFacultyPostGraduatePrograms';
import { Box, Chip, Divider, Paper, TableContainer } from '@mui/material';
import { Table } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableBody } from '@mui/material';
import getCurrentCoordinator from '../../api/PostGraduateProgram/getCurrentCoordinator';
import getAllPostGraduatePrograms from '../../api/PostGraduateProgram/getAllPostGraduatePrograms';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import  useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useNavigate } from 'react-router-dom';


const PostGraduateProgrammes = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { auth } = useAuth();

    const [pgps, setPgps] = useState([]);

    const navigator = useNavigate();

    useSetUserNavigations([
        {
            name: "Dashboard",
            link: "/",
        },
        {
            name: "Postgraduate Programmes",
            link: "/ViewPGPrograms",
        },
    ]);

    useEffect(() => {
        const getPostGraduateProgrammes = async () => {
            const authRole = auth.authRole[0];

            if (authRole === 'vice_chancellor' || authRole === 'cqa_director') {
                let uniResponse = null;

                if (authRole === 'vice_chancellor') {
                    uniResponse = await getViceChancellorUniversity(auth.id);
                } else {
                    uniResponse = await getCQADirectorUniversity(auth.id);
                }

                if (uniResponse.status === 200) {
                    //get the pgps of the university
                    const pgpsResponse = await getUniversityPostGraduatePrograms(uniResponse.data.data.id);

                    if (pgpsResponse.status === 200) {
                        console.log(pgpsResponse.data.data);
                        const pgpData = pgpsResponse.data.data;

                        //go through each pgp and get the faculty and the current coordinator
                        for (let i = 0; i < pgpData.length; i++) {
                            try{
                                const facultyResponse = await getPostGraduateProgramFaculty(pgpData[i].id);

                                if(facultyResponse.status === 200){
                                    pgpData[i].faculty = facultyResponse.data.data;
                                }
                            }
                            catch(error){
                                console.log(error);
                            }

                            try{
                                const coordinatorResponse = await getCurrentCoordinator(pgpData[i].id, { includeAcademicStaff: true, includeUser: true, includeUniversitySide: true });
                                
                                if(coordinatorResponse.status === 200){
                                    pgpData[i].programmeCoordinator = coordinatorResponse.data.data;
                                }
                            }
                            catch(error){
                                if(error.status === 404){
                                    pgpData[i].programmeCoordinator = null;
                                }
                            }
                        }

                        setPgps(pgpData);
                    }
                }
            }
            else if (authRole === 'dean' || authRole === 'iqau_director') {
                let facultyResponse = null;

                if (authRole === 'dean') {
                    facultyResponse = await getDeanFaculty(auth.id);
                } else {
                    facultyResponse = await getIQAUDirectorFaculty(auth.id);
                }

                if (facultyResponse.status === 200) {
                    const facultyData = facultyResponse.data.data;

                    const pgpsResponse = await getFacultyPostGraduatePrograms(facultyData.id);

                    if (pgpsResponse.status === 200) {

                        //get the current coordinator for each pgp
                        const pgpData = pgpsResponse.data.data;

                        for (let i = 0; i < pgpData.length; i++) {
                            try{
                                const coordinatorResponse = await getCurrentCoordinator(pgpData[i].id, { includeAcademicStaff: true, includeUser: true, includeUniversitySide: true });

                                if (coordinatorResponse.status === 200) {
                                    pgpData[i].programmeCoordinator = coordinatorResponse.data.data;
                                }
                            }
                            catch(error){
                                if(error.status === 404){
                                    pgpData[i].programmeCoordinator = null;
                                }
                            }
                        }

                        setPgps(pgpData);
                    }
                }
            }
            else if (authRole === 'qac_officer' || authRole === 'qac_director') {
                const pgpResponse = await getAllPostGraduatePrograms({ includeFaculty: true, includeProgrammeCoordinator: true, includeAcademicStaff: true, includeUser: true, includeUniversitySide: true, includeUniversity: true });

                if (pgpResponse.status === 200) {
                    setPgps(pgpResponse.data.data);
                }
            }

            setIsLoaded(true);
        }

        getPostGraduateProgrammes();
    }, [auth]);

    return (
        isLoaded &&
        <>
            <Divider textAlign='left' sx={{ margin: '1rem 0' }} >
                <Chip label="Postgraduate Programmes" />
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
                {auth.authRole[0] === 'cqa_director' && (
                    <Button variant="contained" startIcon={<AddIcon />}
                        onClick={
                            //go to add new pgp page
                            () => navigator('/cqa_director/AddPGProgramPage')
                        }
                    >
                        Add a new Postgraduate Programme
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#D8E6FC' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Postgraduate Programme</TableCell>
                            {
                                auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                                    <TableCell sx={{ fontWeight: 'bold' }}>Faculty</TableCell>
                                    :
                                    auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                                        <>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Faculty</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>University</TableCell>
                                        </>
                                        :
                                        null
                            }
                            <TableCell sx={{ fontWeight: 'bold' }}>Commencement Year</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>SLQF Level</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Current Programme Coordinator</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            pgps.map((pgp) => (
                                <TableRow key={pgp.id}>
                                    <TableCell>{pgp.title}</TableCell>
                                    {
                                        auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                                            <TableCell>{pgp.faculty.name}</TableCell>
                                            :
                                            auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                                                <>
                                                    <TableCell>{pgp.faculty.name}</TableCell>
                                                    <TableCell>{pgp.faculty.university.name}</TableCell>
                                                </>
                                                :
                                                null
                                    }
                                    <TableCell>{pgp.commencementYear}</TableCell>
                                    <TableCell>{pgp.slqfLevel}</TableCell>
                                    <TableCell>{pgp.programmeCoordinator?.academicStaff.universitySide.user.initials + " " + pgp.programmeCoordinator?.academicStaff.universitySide.user.surname}</TableCell>
                                    <TableCell>
                                        <Button variant='contained'>
                                            View PGPRs
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </TableContainer>


        </>
    )
}

export default PostGraduateProgrammes;