import React from 'react'
import getAcademicStaff from '../../api/AcademicStaff/getAcademicStaff';
import getReviewerProfile from '../../api/Reviewer/getReviewerProfile';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Chip, Divider, List, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SERVER_URL } from '../../assets/constants';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';


const ReviewerProfile = () => {
    const { reviewerId } = useParams();
    const [reviewer, setReviewer] = useState(null);
    const [academicProfile, setAcademicProfile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    useSetUserNavigations(
        [{
            name: "Dashboard",
            link: "/"
        },
        {
            name: "Reviewers",
            link: "/reviewers"
        },
        {
            name: "Reviewer Profile",
            link: "/reviewers/profile/" + reviewerId
        },
        ]
    );

    useEffect(() => {
        const handleGetReviewer = async () => {
            try {
                const reviewerProfileResponse = await getReviewerProfile(reviewerId);

                if (reviewerProfileResponse && reviewerProfileResponse.status === 200) {
                    console.log(reviewerProfileResponse.data.data);

                    setReviewer(reviewerProfileResponse.data.data);

                    const academicProfileResponse = await getAcademicStaff(reviewerProfileResponse.data.data.userData.id);

                    if (academicProfileResponse && academicProfileResponse.status === 200) {
                        console.log(academicProfileResponse.data.data);

                        setAcademicProfile(academicProfileResponse.data.data);

                        setIsLoaded(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        handleGetReviewer();
    }, [reviewerId]);


    return (
        isLoaded &&
        <>
            <Divider textAlign='left'>
                <Chip label="Reviewer Profile" />
            </Divider>
            
            <Box align='center'>
                <Avatar src={SERVER_URL.slice(0, -1) + reviewer.userData.profilePic} />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Initials</Typography>
                <Typography variant='h6'>{reviewer.userData.initials}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Surname</Typography>
                <Typography variant='h6'>{reviewer.userData.surname}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Full Name</Typography>
                <Typography variant='h6'>{reviewer.userData.fullName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Gender</Typography>
                <Typography variant='h6'>{reviewer.userData.gender}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>National Identity Card Number</Typography>
                <Typography variant='h6'>{reviewer.userData.nic}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Official Telephone Number</Typography>
                <Typography variant='h6'>{reviewer.userData.officialTelephoneNo}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Other Contact Numbers</Typography>
                <List>
                    {
                        JSON.parse(reviewer.userData.contactNo).map((number, index) => {
                            return (
                                <Typography variant='h6' key={index}>{number}</Typography>
                            )
                        })
                    }

                </List>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Official Email</Typography>
                <Typography variant='h6'>{reviewer.userData.officialEmail}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Personal Email</Typography>
                <Typography variant='h6'>{reviewer.userData.personalEmail}</Typography>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Working Faculty and University</Typography>
                <Typography variant='h6'>{reviewer.faculty.name + " at " + reviewer.faculty.university.name}</Typography>
            </Box>

            <Divider />
            <Typography variant='h6' align='center'>Academic Profile</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Designation</Typography>
                <Typography variant='h6'>{academicProfile.designation}</Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Department</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center'>Name</TableCell>
                                <TableCell align='center'>Department Head</TableCell>
                                <TableCell align='center'>Department Head Email</TableCell>
                                <TableCell align='center'>Department Postal Address</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align='center'>{academicProfile.department.name}</TableCell>
                                <TableCell align='center'>{academicProfile.department.headName}</TableCell>
                                <TableCell align='center'>{academicProfile.department.headEmail}</TableCell>
                                <TableCell align='center'>{academicProfile.department.postalAddress}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Number of Abstracts</Typography>
                <Typography variant='h6'>{academicProfile.abstractCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Number of Book Chapters</Typography>
                <Typography variant='h6'>{academicProfile.bookChapters}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Number of Conference Preceedings</Typography>
                <Typography variant='h6'>{academicProfile.conferencePreceedingsCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Number of Postgraduate Students Supervised</Typography>
                <Typography variant='h6'>{academicProfile.supervisedPostgraduateStudentCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Number of publications in Referred Journals</Typography>
                <Typography variant='h6'>{academicProfile.publicationsInReferredJournalsCount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>Google Scholar Link</Typography>
                {academicProfile.cv ? (
                    <Button component={Link} to={"/" + academicProfile.googleScholarLink} target='_blank' rel='noopener noreferrer'>
                        View Google Scholar Profile
                    </Button>
                ) :
                    <Typography>No Link provided</Typography>
                }
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                <Typography variant='h6'>CV File</Typography>
                {academicProfile.cv ? (
                    <Button component={Link} to={SERVER_URL.slice(0, -1) + academicProfile.cv} target='_blank' rel='noopener noreferrer'>
                        Download CV
                    </Button>
                ) :
                    <Typography>No CV provided</Typography>
                }
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Experience in Industry</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.experienceInIndustry.map((experience, index) =>
                            (
                                <TableRow key={experience + index}>
                                    <TableCell align='center'>
                                        {experience}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Experience With Research Funds</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.experienceWithResearchFunds.map((experience, index) =>
                            (
                                <TableRow key={experience + index}>
                                    <TableCell align='center'>
                                        {experience}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Involvement in Internal Quality Assurances</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.involvementInInternalQualityAssurance.map((involvement, index) =>
                            (
                                <TableRow key={involvement + index}>
                                    <TableCell align='center'>
                                        {involvement}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Involvement in Study Programme Development</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.involvementInStudyProgrammeDevelopment.map((involvement, index) =>
                            (
                                <TableRow key={involvement + index}>
                                    <TableCell align='center'>
                                        {involvement}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Nominees</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.nominees.map((nominee, index) =>
                            (
                                <TableRow key={nominee + index}>
                                    <TableCell align='center'>
                                        {nominee}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Postgraduate Qualifications</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.postgraduateQualifications.map((qualification, index) =>
                            (
                                <TableRow key={qualification + index}>
                                    <TableCell align='center'>
                                        {qualification}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Postgraduate Teaching Experience</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.postgraduateTeachingExperience.map((experience, index) =>
                            (
                                <TableRow key={experience + index}>
                                    <TableCell align='center'>
                                        {experience}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Typography variant='h6'>Prior Training in Programme Reviews</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {academicProfile.priorTrainingInProgrammeReview.map((training, index) =>
                            (
                                <TableRow key={training + index}>
                                    <TableCell align='center'>
                                        {training}
                                    </TableCell>
                                </TableRow>
                            )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default ReviewerProfile