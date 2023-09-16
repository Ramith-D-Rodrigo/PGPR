import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Modal, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import getCoordinatorPGP from '../../api/ProgrammeCoordinator/getCoordinatorPGP';
import getPostGraduatePRogramPGPRs from '../../api/PostGraduateProgram/getPostGraduatePRogramPGPRs';
import { Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Style } from '@mui/icons-material';
import getPGPRApplication from '../../api/PostGraduateProgramApplication/getPGPRApplication';
import { SERVER_URL } from '../../assets/constants';

const PGPRs = () => {

  const [PGPRs, setPGPRs] = React.useState([]);
  const { auth } = useAuth();

  React.useEffect(() => {
    const getData = async () => {
      try {
        const pgpResponse = await getCoordinatorPGP(auth.id);

        if (pgpResponse && pgpResponse.status === 200) {
          console.log(pgpResponse.data.data);
          const pgprResponse = await getPostGraduatePRogramPGPRs(pgpResponse.data.data.id, { includeSelfEvaluationReport: true });

          if (pgprResponse && pgprResponse.status === 200) {
            console.log(pgprResponse.data.data);

            const pgprData = pgprResponse.data.data;
            pgprData.ppg = pgpResponse.data.data;

            setPGPRs(pgprData);
          }
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [auth.id]);

  const [viewingApplication, setViewingApplication] = React.useState(null);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);

  const openApplicationPopUp = () => {
    setOpen(true);
  };

  const closeApplicationPopUp = () => {
    setOpen(false);
    setViewingApplication(null);
  };

  const [viewingApplicationData, setViewingApplicationData] = React.useState(null);

  useEffect(() => {
    const getApplicationData = async () => {
      if (!viewingApplication) {
        return;
      }
      try {
        const response = await getPGPRApplication(viewingApplication);

        if (response && response.status === 200) {
          console.log(response.data.data);
          setViewingApplicationData(response.data.data);
        }

      } catch (error) {
        console.log(error);
      }
    }

    getApplicationData();
  }, [viewingApplication]);




  //create a simple modal using material ui
  const ApplicationPopUp = () => {
    return (
      <Modal
        open={open}
        onClose={closeApplicationPopUp}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Post Graduate Programme Review Application
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <Typography>
              Application ID: {viewingApplicationData?.id}
            </Typography>
            <Typography>
              Application Status: {viewingApplicationData?.status.charAt(0).toUpperCase() + viewingApplicationData?.status.slice(1)}
            </Typography>
            <Typography>
              Request Date: {viewingApplicationData?.requestDate}
            </Typography>
            <Typography>
              Application Date: {viewingApplicationData?.applicationDate}
            </Typography>
            <Typography>
              Years:
              <List>
                <ListItem>
                  <Typography>
                    Year 1: {viewingApplicationData?.year1}
                  </Typography>
                  <Typography>
                    Year 2: {viewingApplicationData?.year2}
                  </Typography>
                  <Typography>
                    Year 3: {viewingApplicationData?.year3}
                  </Typography>
                  <Typography>
                    Year 4: {viewingApplicationData?.year4}
                  </Typography>
                  <Typography>
                    Year 5: {viewingApplicationData?.year5}
                  </Typography>
                </ListItem>
              </List>
            </Typography>
            <Typography>
              Year 5 End Date: {viewingApplicationData?.yEnd}
            </Typography>
            <Typography>
              Intent Letter :
              <a href={SERVER_URL.slice(0, -1) + viewingApplicationData?.intentLetter}>
                <Button variant='contained'>
                  Download
                </Button>
              </a>
            </Typography>
          </Typography>
        </Box>
      </Modal>
    )
  }

  return (
    <>
      <ApplicationPopUp />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PRGR ID</TableCell>
              <TableCell>PostGraduate Programme</TableCell>
              <TableCell>Is Grouped?</TableCell>
              <TableCell>Application</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {PGPRs.map((pgpr) => (
              <TableRow key={pgpr.id}>
                <TableCell>{pgpr.id}</TableCell>
                <TableCell>{PGPRs.ppg.title}</TableCell>
                <TableCell>{pgpr.groupedWith ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button variant="contained" color="primary" size="small" onClick={() => {
                      setViewingApplication(pgpr.pgprApplicationId);
                      openApplicationPopUp();
                    }}>View</Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>{pgpr.statusOfPgpr}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Link to={`/programme_coordinator/pgprs/${pgpr?.selfEvaluationReport.id}`}>
                      <Button variant="contained" color="primary" size="small">View More</Button>
                    </Link>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PGPRs