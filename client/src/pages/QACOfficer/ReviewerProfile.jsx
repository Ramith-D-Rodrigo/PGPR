import React from 'react'
import getAcademicStaff from '../../api/AcademicStaff/getAcademicStaff';
import getReviewerProfile from '../../api/Reviewer/getReviewerProfile';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Chip, Divider, List, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SERVER_URL } from '../../assets/constants';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { styled } from '@mui/material/styles';


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

    const container = { display: 'flex', justifyContent: 'space-around', width: '70%', alignItems: 'center' };
    const child = { width: '50%', marginLeft: '10rem' };

    //create a single styled class for table, table head, table row and table cell
    const tableStyle = {
        minWidth: 650,
        borderCollapse: 'separate',
        borderSpacing: '0 10px',
        '& th': {
            backgroundColor: '#D8E6FC',
            fontWeight: 'bold',
            padding: '10px',
            textAlign: 'center',
            borderBottom: '1px solid #ddd',
        },
        '& td': {
            padding: '10px',
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
        },
        '& tbody tr:hover': {
            backgroundColor: '#f5f5f5',
        },
    }

    return (
        isLoaded &&
        <>
            


            <Divider textAlign='left'>
                <Chip label="Reviewer Profile" />
            </Divider>

            <Box align='center'>
                <Avatar src={SERVER_URL.slice(0, -1) + reviewer.userData.profilePic}
                    sx={{ width: '15rem', height: '15rem', mb: 2 }}
                />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                <Box sx={container}>
                    <Box sx={child}>Initials</Box>
                    <Box sx={child}>{reviewer.userData.initials}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Surname</Box>
                    <Box sx={child}>{reviewer.userData.surname}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Full Name</Box>
                    <Box sx={child}>{reviewer.userData.fullName}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Gender</Box>
                    <Box sx={child}>{reviewer.userData.gender}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>National Identity Card Number</Box>
                    <Box sx={child}>{reviewer.userData.nic}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Official Telephone Number</Box>
                    <Box sx={child}>{reviewer.userData.officialTelephoneNo}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Other Contact Numbers</Box>
                    <List sx={child}>
                        {
                            JSON.parse(reviewer.userData.contactNo).map((number, index) => {
                                return (
                                    <Box key={index}>{number}</Box>
                                )
                            })
                        }

                    </List>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Official Email</Box>
                    <Box sx={child}>{reviewer.userData.officialEmail}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Personal Email</Box>
                    <Box sx={child}>{reviewer.userData.personalEmail}</Box>
                </Box>
                <Divider />
                <Box sx={container}>
                    <Box sx={child}>Working Faculty and University</Box>
                    <Box sx={child}>{reviewer.faculty.name + " at " + reviewer.faculty.university.name}</Box>
                </Box>

                <Divider textAlign='center' sx={{ margin: '1rem' }}>
                    <Chip label="Academic Profile" />
                </Divider>
                <Box sx={container}>
                    <Box sx={child}>Designation</Box>
                    <Box sx={child}>{academicProfile.designation}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Number of Abstracts</Box>
                    <Box sx={child}>{academicProfile.abstractCount}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Number of Book Chapters</Box>
                    <Box sx={child}>{academicProfile.bookChapters}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Number of Conference Preceedings</Box>
                    <Box sx={child}>{academicProfile.conferencePreceedingsCount}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Number of Postgraduate Students Supervised</Box>
                    <Box sx={child}>{academicProfile.supervisedPostgraduateStudentCount}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Number of publications in Referred Journals</Box>
                    <Box sx={child}>{academicProfile.publicationsInReferredJournalsCount}</Box>
                </Box>
                <Box sx={container}>
                    <Box sx={child}>Google Scholar Link</Box>
                    {academicProfile.cv ? (
                        <Button component={Link} to={"/" + academicProfile.googleScholarLink} target='_blank' rel='noopener noreferrer' sx={{ textAlign: 'center', ...child }}>
                            View Google Scholar Profile
                        </Button>
                    ) :
                        <Box sx={child}>No Link provided</Box>
                    }
                </Box>

                <Box sx={container}>
                    <Box sx={child}>CV File</Box>
                    {academicProfile.cv ? (
                        <Button component={Link} to={SERVER_URL.slice(0, -1) + academicProfile.cv} target='_blank' rel='noopener noreferrer' sx={{ textAlign: 'center', ...child }}>
                            Download CV
                        </Button>
                    ) :
                        <Box sx={child}>No CV provided</Box>
                    }
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%', margin: '1rem' }}>
                    <Box sx={{ margin: '1rem' }}>Department</Box>
                    <TableContainer>
                        <Table sx={tableStyle}>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Experience In Industry</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {academicProfile.experienceInIndustry.map((experience, index) => (
                                    <TableRow key={experience + index}>
                                        <TableCell align='center'>{experience}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Experience With Research Funds</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Involvement in Internal Quality Assurances</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Involvement in Study Programme Development</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Nominees</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Postgraduate Qualifications</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Postgraduate Teaching Experience</TableCell>
                                </TableRow>
                            </TableHead>
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

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '70%' }}>
                    <TableContainer>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Prior Training in Programme Reviews</TableCell>
                                </TableRow>
                            </TableHead>
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
            </Box>


        </>
    )
}

export default ReviewerProfile