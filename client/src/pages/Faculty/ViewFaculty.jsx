import useAuth from "../../hooks/useAuth.js";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAFaculty from "../../api/Faculty/getAFaculty.js";
import getCurrentDean from "../../api/Faculty/getCurrentDean.js";
import getCurrentIQAUDirector from "../../api/Faculty/getCurrentIQAUDirector.js";
import { Avatar, Button, Divider, Typography } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SERVER_URL } from "../../assets/constants.js";
import { Link } from "react-router-dom";

const ViewFaculty = () => {
    const {auth} = useAuth();
    const {facultyId} = useParams();

    const [faculty, setFaculty] = useState(null);

    useEffect(() => {
        document.title = "View Faculty";

        const getFaculty = async () => {
            try{
                //get the faculty
                const queryParams = {
                    includeUniversity: true,
                    includeIQAU: true
                }

                const facultyResponse = await getAFaculty(facultyId, queryParams);

                if(facultyResponse?.status === 200){
                    const facultyData = facultyResponse?.data?.data;

                    //get faculty current dean

                    const queryParams1 = {
                        includeUser: true,
                        includeAcademicStaff: true,
                        includeUniversitySide: true
                    }
                    const deanResponse = await getCurrentDean(facultyId, queryParams1);

                    if(deanResponse?.status === 200){
                        facultyData.dean = deanResponse?.data?.data;
                        
                        //get faculty current IQAU director
                        const queryParams2 = {
                            includeUser: true,
                            includeQualityAssuranceStaff: true,
                            includeUniversitySide: true
                        }


                        const iqauDirectorResponse = await getCurrentIQAUDirector(facultyId, queryParams2);

                        if(iqauDirectorResponse?.status === 200){
                            facultyData.iqauDirector = iqauDirectorResponse?.data?.data;
                        }
                    }

                    console.log(facultyData);

                    setFaculty(facultyData);
                }
            }
            catch(error){
                console.log(error);
            }
        }

        getFaculty();
    }, [facultyId]);

    return (
        <>
            <Typography variant="h4" sx={{mb: 5}}>
                View Faculty
            </Typography>

            {
                faculty &&
                <>
                    <Typography variant="h6" sx={{mb: 2}}>
                        Name: {faculty.name}
                    </Typography>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Website: {faculty.website}
                    </Typography>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Address: {faculty.address}
                    </Typography>

                    <Select value={'Contact Numbers'}>
                        <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id+'defaultcontact'} value={'Contact Numbers'}>
                            Contact Numbers
                        </MenuItem>
                        {faculty.contactNo.data.map(contactNo => {
                            return (
                                <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id + contactNo}>
                                    {contactNo}
                                </MenuItem>
                            )
                        }
                        
                        )}
                    </Select>

                    <Select value={'Fax Numbers'}>
                        <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id+'defaultfax'} value={'Fax Numbers'}>
                            Fax Numbers
                        </MenuItem>
                        {faculty.faxNo.data.map(faxNo => {
                            return (
                                <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id + faxNo}>
                                    {faxNo}
                                </MenuItem>
                            )
                        }
                        
                        )}
                    </Select>

                    <Divider sx={{my: 2}}/>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Dean : {faculty.dean.academicStaff.universitySide.user.initials + ' ' + faculty.dean.academicStaff.universitySide.user.surname}
                        <Avatar src={SERVER_URL.slice(0, -1) +  faculty.dean.academicStaff.universitySide.user.profilePic} sx={{ml: 2}}/>

                        
                        {auth.authRole[0] === 'cqa_director' &&
                            <>
                            {/*edit button for Dean*/}
                                <Button
                                    variant="contained"
                                    sx={{ml: 2}}
                                >
                                    Edit Dean
                                </Button>

                            </>      
                        }
                    </Typography>

                    <Divider sx={{my: 2}}/>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Internal Quality Assurance Unit
                    </Typography>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Address : {faculty.internalQualityAssuranceUnit.address}
                    </Typography>

                    <Select value={'Contact Numbers'}>
                        <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id+'defaultcontactiqau'} value={'Contact Numbers'}>
                            Contact Numbers
                        </MenuItem>
                        {faculty.internalQualityAssuranceUnit.contactNo.data.map(contactNo => {
                            return (
                                <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id + contactNo}>
                                    {contactNo}
                                </MenuItem>
                            )
                        }
                        
                        )}
                    </Select>

                    <Select value={'Fax Numbers'}>
                        <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id+'defaultfaxiqau'} value={'Fax Numbers'}>
                            Fax Numbers
                        </MenuItem>
                        {faculty.internalQualityAssuranceUnit.faxNo.data.map(faxNo => {
                            return (
                                <MenuItem variant="h6" sx={{mb: 2}} key={faculty.id + faxNo}>
                                    {faxNo}
                                </MenuItem>
                            )
                        }
                        
                        )}
                    </Select>

                    <Typography variant="h6" sx={{mb: 2}}>
                        Current Director : {faculty.iqauDirector.qualityAssuranceStaff.universitySide.user.initials + ' ' + faculty.iqauDirector.qualityAssuranceStaff.universitySide.user.surname}
                        <Avatar src={SERVER_URL.slice(0, -1) +  faculty.iqauDirector.qualityAssuranceStaff.universitySide.user.profilePic} sx={{ml: 2}}/>

                        {auth.authRole[0] === 'cqa_director' &&
                            <>
                            {/*edit button for director*/}
                                <Button
                                    variant="contained"
                                    sx={{ml: 2}}
                                >
                                    Edit Director
                                </Button>

                            </>      
                        }

                    </Typography>

                    <Divider sx={{my: 2}}/>

                    <Typography variant="h6" sx={{mb: 2}}>
                        University
                        <Button 
                            variant="contained"
                            sx={{ml: 2}}
                            component={Link}
                            to={`universities/${faculty.university.id}`}
                        >
                            View University
                        </Button>
                    </Typography>


                </>
            }
        
        </>
    )
}

export default ViewFaculty