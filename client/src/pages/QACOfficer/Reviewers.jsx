import { Button, ButtonGroup, Divider, TableContainer } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import getAllReviewers from '../../api/Reviewer/getAllReviewers'
import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import useAuth from '../../hooks/useAuth';

const Reviewers = () => {
  const [reviewers, setReviewers] = useState([]);
  const {auth} = useAuth();

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
      <h1>Reviewers</h1>
      <Button>
        <Link to="/qac_officer/reviewers/import">Import Reviewers</Link>
      </Button>

      <Divider />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow >
              <TableCell align='center'>Reviewer ID</TableCell>
              <TableCell align='center'>Name</TableCell>
              <TableCell align='center'>Official Email</TableCell>
              <TableCell align='center'>Working Faculty</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Action</TableCell>
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