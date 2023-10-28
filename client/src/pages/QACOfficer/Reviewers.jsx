import { Button, ButtonGroup, Chip, Divider, TableContainer } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import getAllReviewers from '../../api/Reviewer/getAllReviewers'
import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import Box from '@mui/material/Box';

const Reviewers = () => {
  const [reviewers, setReviewers] = useState([]);
  const { auth } = useAuth();

  useSetUserNavigations(
    [{
      name: "Dashboard",
      link: "/"
    },
    {
      name: "Reviewers",
      link: "/reviewers"
    },
    ]
  );

  useEffect(() => {
    const handleGetReviewers = async () => {
      try {
        const response = await getAllReviewers();
        console.log(response.data.data);
        setReviewers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    handleGetReviewers();
  }, []);

  return (
    <>
      <Divider textAlign='left'>
        <Chip label="Reviewers"/>
      </Divider>

      <Box sx={{display:'flex', flexDirection:'row-reverse', mb:3}}>
      <Button color='primary' variant='contained'>
        <Link to={`/${auth.authRole[0]}/reviewers/import`}>Import Reviewers</Link>
      </Button>
      </Box>

      <Divider />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{backgroundColor:"#D8E6FC",}}>
              <TableCell align='center'><strong>Reviewer ID</strong></TableCell>
              <TableCell align='center'><strong>Name</strong></TableCell>
              <TableCell align='center'><strong>Official Email</strong></TableCell>
              <TableCell align='center'><strong>Working Faculty</strong></TableCell>
              <TableCell align='center'><strong>Status</strong></TableCell>
              <TableCell align='center'><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {reviewers.map((reviewer) => (
              <TableRow
                key={reviewer.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >

                <TableCell component="th" scope="row" align='center'>
                  {reviewer.userData.id}
                </TableCell>

                <TableCell align='center'>{reviewer.userData.initials + " " + reviewer.userData.surname}</TableCell>
                <TableCell align='center'>{reviewer.userData.officialEmail}</TableCell>
                <TableCell align='center'>{reviewer.faculty.name}</TableCell>
                <TableCell align='center'>{reviewer.reviewerStatus}</TableCell>
                <TableCell align='center'>
                  <ButtonGroup aria-label="text button group">
                    <Button component={Link} to={`/${auth.authRole[0]}/reviewers/${reviewer.userData.id}`}>
                      View Profile
                    </Button>
                    <Button color='error'>
                      Suspend Account
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Reviewers