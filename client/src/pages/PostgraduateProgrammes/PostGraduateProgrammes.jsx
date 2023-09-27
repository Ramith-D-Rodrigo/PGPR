import getCQADirectorUniversity from '../../api/CQADirector/getCQADirectorUniversity';
import getUniversityPostGraduatePrograms from '../../api/University/getUniversityPostGraduatePrograms';
import getViceChancellorUniversity from '../../api/ViceChancellor/getViceChancellorUniversity';
import useAuth from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import getPostGraduateProgramFaculty from '../../api/PostGraduateProgram/getPostGraduateProgramFaculty';
import getDeanFaculty from '../../api/Dean/getDeanFaculty';
import getIQAUDirectorFaculty from '../../api/IQAUDirector/getIQAUDirectorFaculty';
import getFacultyPostGraduatePrograms from '../../api/Faculty/getFacultyPostGraduatePrograms';
import { TableContainer } from '@mui/material';
import { Table } from '@mui/material';
import { TableHead } from '@mui/material';
import { TableRow } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableBody } from '@mui/material';
import getCurrentCoordinator from '../../api/PostGraduateProgram/getCurrentCoordinator';
import getAllPostGraduatePrograms from '../../api/PostGraduateProgram/getAllPostGraduatePrograms';
import { Button } from '@mui/material';


const PostGraduateProgrammes = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const {auth} = useAuth();

    const [pgps, setPgps] = useState([]);

    useEffect(() => {
        const getPostGraduateProgrammes = async () => {
            const authRole = auth.authRole[0];

            if(authRole === 'vice_chancellor' || authRole === 'cqa_director'){
                let uniResponse = null;

                if(authRole === 'vice_chancellor'){
                    uniResponse = await getViceChancellorUniversity(auth.id);
                }else{
                    uniResponse = await getCQADirectorUniversity(auth.id);
                }

                if(uniResponse.status === 200){
                    //get the pgps of the university
                    const pgpsResponse = await getUniversityPostGraduatePrograms(uniResponse.data.data.id);

                    if(pgpsResponse.status === 200){
                        console.log(pgpsResponse.data.data);
                        const pgpData = pgpsResponse.data.data;

                        //go through each pgp and get the faculty and the current coordinator
                        for(let i = 0; i < pgpData.length; i++){
                            const facultyResponse = await getPostGraduateProgramFaculty(pgpData[i].id);

                            const coordinatorResponse = await getCurrentCoordinator(pgpData[i].id, {includeAcademicStaff: true, includeUser: true, includeUniversitySide: true});

                            if(facultyResponse.status === 200 && coordinatorResponse.status === 200){
                                pgpData[i].faculty = facultyResponse.data.data;
                                pgpData[i].programmeCoordinator = coordinatorResponse.data.data;
                            }
                        }

                        setPgps(pgpData);
                    }
                }
            }
            else if(authRole === 'dean' || authRole === 'iqau_director'){
                let facultyResponse = null;

                if(authRole === 'dean'){
                    facultyResponse = await getDeanFaculty(auth.id);
                }else{
                    facultyResponse = await getIQAUDirectorFaculty(auth.id);
                }

                if(facultyResponse.status === 200){
                    const facultyData = facultyResponse.data.data;

                    const pgpsResponse = await getFacultyPostGraduatePrograms(facultyData.id);

                    if(pgpsResponse.status === 200){
                        
                        //get the current coordinator for each pgp
                        const pgpData = pgpsResponse.data.data;

                        for(let i = 0; i < pgpData.length; i++){
                            const coordinatorResponse = await getCurrentCoordinator(pgpData[i].id, {includeAcademicStaff: true, includeUser: true, includeUniversitySide: true});

                            if(coordinatorResponse.status === 200){
                                pgpData[i].programmeCoordinator = coordinatorResponse.data.data;
                            }
                        }

                        setPgps(pgpData);
                    }
                } 
            }
            else if(authRole === 'qac_officer' || authRole === 'qac_director'){
                const pgpResponse = await getAllPostGraduatePrograms({includeFaculty: true, includeProgrammeCoordinator: true, includeAcademicStaff: true, includeUser: true, includeUniversitySide: true, includeUniversity: true});

                if(pgpResponse.status === 200){
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
            <h1>Post Graduate Programmes</h1>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Postgraduate Programme</TableCell>
                            {
                                auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                                <TableCell>Faculty</TableCell>
                                :
                                auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                                <>
                                    <TableCell>Faculty</TableCell>
                                    <TableCell>University</TableCell>
                                </>
                                :
                                null
                            }
                            <TableCell>Commencement Year</TableCell>
                            <TableCell>SLQF Level</TableCell>
                            <TableCell>Current Programme Coordinator</TableCell>
                            <TableCell>Actions</TableCell>
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
                                    <TableCell>{pgp.programmeCoordinator.academicStaff.universitySide.user.initials + " "+ pgp.programmeCoordinator.academicStaff.universitySide.user.surname}</TableCell>
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