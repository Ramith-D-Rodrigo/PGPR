import React from 'react'
import getAcademicStaff from '../../api/AcademicStaff/getAcademicStaff';
import getReviewerProfile from '../../api/Reviewer/getReviewerProfile';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Divider, List, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SERVER_URL } from '../../assets/constants';


const ReviewerProfile = () => {
    const {reviewerId} = useParams();
    const [reviewer, setReviewer] = useState(null);
    const [academicProfile, setAcademicProfile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleGetReviewer = async () => {
            try {
                const reviewerProfileResponse = await getReviewerProfile(reviewerId);

                if(reviewerProfileResponse && reviewerProfileResponse.status === 200){
                    console.log(reviewerProfileResponse.data.data);

                    setReviewer(reviewerProfileResponse.data.data);

                    const academicProfileResponse = await getAcademicStaff(reviewerProfileResponse.data.data.userData.id);

                    if(academicProfileResponse && academicProfileResponse.status === 200){
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
            <Typography variant='h4' align='center'>Reviewer Profile</Typography>
            <Box align='center'>
                <Avatar src={SERVER_URL.slice(0, -1) + reviewer.userData.profilePic} />
            </Box>

            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Initials</Typography>
                <Typography variant='h6'>{reviewer.userData.initials}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Surname</Typography>
                <Typography variant='h6'>{reviewer.userData.surname}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Full Name</Typography>
                <Typography variant='h6'>{reviewer.userData.fullName}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Gender</Typography>
                <Typography variant='h6'>{reviewer.userData.gender}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>National Identity Card Number</Typography>
                <Typography variant='h6'>{reviewer.userData.nic}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Official Telephone Number</Typography>
                <Typography variant='h6'>{reviewer.userData.officialTelephoneNo}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
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
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Official Email</Typography>
                <Typography variant='h6'>{reviewer.userData.officialEmail}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Personal Email</Typography>
                <Typography variant='h6'>{reviewer.userData.personalEmail}</Typography>
            </Box>
            <Divider/>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Working Faculty and University</Typography>
                <Typography variant='h6'>{reviewer.faculty.name + " at " + reviewer.faculty.university.name}</Typography>
            </Box>

            <Divider/>
            <Typography variant='h6' align='center'>Academic Profile</Typography>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Designation</Typography>
                <Typography variant='h6'>{academicProfile.designation}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Number of Abstracts</Typography>
                <Typography variant='h6'>{academicProfile.abstractCount}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Number of Book Chapters</Typography>
                <Typography variant='h6'>{academicProfile.bookChapters}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent: 'space-around', width: '100%'}}>
                <Typography variant='h6'>Number of Conference Preceedings</Typography>
                <Typography variant='h6'>{academicProfile.conferencePreceedingsCount}</Typography>
            </Box>

        </>
    )
}

export default ReviewerProfile