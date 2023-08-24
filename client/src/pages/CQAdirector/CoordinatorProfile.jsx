import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const CoordinatorProfile = () => {
  const { id } = useParams(); // Get the coordinator ID from URL parameter

  // Simulated data fetch based on the coordinator ID
  const coordinatorProfileData = {
    cid: id,
    profilePhoto: 'https://randomuser.me/api/portraits/men/1.jpg', // Placeholder image
    name: 'Dr. Manju',
    faculty: 'Science Faculty',
    university: 'University of Colombo',
    numOfPgPrograms: 3,
    pgPrograms: [
      { pgprId: 'UOC-12', name: 'Program 1', status: 'Active' },
      { pgprId: 'UOC-13', name: 'Program 2', status: 'Approved' },
      { pgprId: 'UOC-14', name: 'Program 3', status: 'Completed' },
    ],
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <Paper elevation={3} className="p-6 space-y-4 w-full md:max-w-3xl">
        <Typography variant="h4" className="font-bold mb-4 text-center">
          Coordinator Profile
        </Typography>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Avatar alt="Profile Photo" src={coordinatorProfileData.profilePhoto} sx={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="ml-6 text-black flex-grow">
            <Typography variant="h5" className="font-bold mb-2">
              <span className="text-2xl">{coordinatorProfileData.name}</span>
            </Typography>
            <Typography variant="body1" className="mb-2">
              <span className="font-bold">Coordinator ID:</span> {coordinatorProfileData.cid}
            </Typography>
            <Typography variant="body1" className="mb-2">
              <span className="font-bold">Faculty/Institute:</span> {coordinatorProfileData.faculty}
            </Typography>
            <Typography variant="body1" className="mb-2">
              <span className="font-bold">University:</span> {coordinatorProfileData.university}
            </Typography>
            <Typography variant="body1" className="mb-2">
              <span className="font-bold">No. of PG Programs:</span> {coordinatorProfileData.numOfPgPrograms}
            </Typography>
          </div>
        </div>
        <hr className="border-t-2 border-black my-4 opacity-50" />
        <div>
          <Typography variant="h6" className="font-bold mb-2 text-center">
            Coordinated PG Programs
          </Typography>
          <div className="mb-4">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PGPR ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coordinatorProfileData.pgPrograms.map((program) => (
                    <TableRow key={program.pgprId}>
                      <TableCell>{program.pgprId}</TableCell>
                      <TableCell>{program.name}</TableCell>
                      <TableCell>{program.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default CoordinatorProfile;


