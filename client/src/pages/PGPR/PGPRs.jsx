import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Modal, Typography, List, ListItem } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import getCoordinatorPGP from '../../api/ProgrammeCoordinator/getCoordinatorPGP';
import getPostGraduateProgramPGPRs from '../../api/PostGraduateProgram/getPostGraduateProgramPGPRs';
import { Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Style } from '@mui/icons-material';
import getPGPRApplication from '../../api/PostGraduateProgramApplication/getPGPRApplication';
import { SERVER_URL } from '../../assets/constants';
import getDeanFaculty from '../../api/Dean/getDeanFaculty';
import getFacultyPostGraduatePrograms from '../../api/Faculty/getFacultyPostGraduatePrograms';
import getIQAUDirectorFaculty from '../../api/IQAUDirector/getIQAUDirectorFaculty';
import getCQADirectorUniversity from '../../api/CQADirector/getCQADirectorUniversity';
import getViceChancellorUniversity from '../../api/ViceChancellor/getViceChancellorUniversity';
import getUniversityPostGraduatePrograms from '../../api/University/getUniversityPostGraduatePrograms';
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import getPostGraduateProgramFaculty from '../../api/PostGraduateProgram/getPostGraduateProgramFaculty';


const PGPRs = () => {

  const [PGPRs, setPGPRs] = React.useState([]);
  const { auth } = useAuth();

  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const authRole = auth.authRole[0];
        if(authRole === 'programme_coordinator'){
          const pgpResponse = await getCoordinatorPGP(auth.id);

          if (pgpResponse && pgpResponse.status === 200) {
            console.log(pgpResponse.data.data);
            const pgprResponse = await getPostGraduateProgramPGPRs(pgpResponse.data.data.id, { includeSelfEvaluationReport: true });
  
            if (pgprResponse && pgprResponse.status === 200) {
              console.log(pgprResponse.data.data);
  
              const pgprData = pgprResponse.data.data;
              for(let i = 0; i < pgprData.length; i++){
                pgprData[i].postGraduateProgramme = pgpResponse.data.data;
              }
  
              setPGPRs(pgprData);
              setIsLoaded(true);
            }
          }
        }
        else if(authRole === 'dean' || authRole === 'iqau_director'){
          let facultyResponse = null;

          if(authRole === 'dean'){
            facultyResponse = await getDeanFaculty(auth.id);
          }
          else if(authRole === 'iqau_director'){
            facultyResponse = await getIQAUDirectorFaculty(auth.id);
          }

          if (facultyResponse && facultyResponse.status === 200) {
            const facultyPGPsResponse = await getFacultyPostGraduatePrograms(facultyResponse.data.data.id);
  
            if (facultyPGPsResponse && facultyPGPsResponse.status === 200) {
              const  pgprArr = [];
              for(let i = 0; i < facultyPGPsResponse.data.data.length; i++){
                const pgprResponse = await getPostGraduateProgramPGPRs(facultyPGPsResponse.data.data[i].id, { includeSelfEvaluationReport: true });
                

                if (pgprResponse && pgprResponse.status === 200) {
                  console.log(pgprResponse.data.data);
    
                  const pgprData = pgprResponse.data.data;
                  for(let i = 0; i < pgprData.length; i++){
                    pgprData[i].postGraduateProgramme = facultyPGPsResponse.data.data[i];
                  }
                  
                  pgprArr.push(...pgprData);
                }
              }

              setPGPRs(pgprArr);
              setIsLoaded(true);
            }
          }
        }
        else if(authRole === 'cqa_director' || authRole === 'vice_chancellor'){
          let universityResponse = null;

          if(authRole === 'cqa_director'){
            universityResponse = await getCQADirectorUniversity(auth.id);
          }
          else if(authRole === 'vice_chancellor'){
            universityResponse = await getViceChancellorUniversity(auth.id);
          }

          if (universityResponse && universityResponse.status === 200) {
            const universityPGPsResponse = await getUniversityPostGraduatePrograms(universityResponse.data.data.id);
  
            if (universityPGPsResponse && universityPGPsResponse.status === 200) {
              const pgprArr = [];

              for(let i = 0; i < universityPGPsResponse.data.data.length; i++){
                const pgprResponse = await getPostGraduateProgramPGPRs(universityPGPsResponse.data.data[i].id, { includeSelfEvaluationReport: true });
  
                if (pgprResponse && pgprResponse.status === 200) {
                  console.log(pgprResponse.data.data);
                  
                  //get the faculty of the pgp
                  const facultyResponse = await getPostGraduateProgramFaculty(universityPGPsResponse.data.data[i].id);
    
                  if (facultyResponse && facultyResponse.status === 200) {
                    const pgprData = pgprResponse.data.data;

                    for(let j = 0; j < pgprData.length; j++){
                      pgprData[j].postGraduateProgramme = universityPGPsResponse.data.data[i];
                      pgprData[j].postGraduateProgramme.faculty = facultyResponse.data.data;
                    }

                    pgprArr.push(...pgprData);
                  }
                }
              }

              console.log(pgprArr);
              setPGPRs(pgprArr);
              setIsLoaded(true);
            }
          }
        }
        else if(authRole === 'qac_officer' || authRole === 'qac_director'){
          const allPGPRresponse = await getAllPGPRs();

          if (allPGPRresponse && allPGPRresponse.status === 200) {
            console.log(allPGPRresponse.data.data);
            const allPGPRs = allPGPRresponse.data.data;

            setPGPRs(allPGPRs);
            setIsLoaded(true);
          }
        }
      }
      catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [auth.id, auth.authRole]);

  const [viewingApplication, setViewingApplication] = React.useState(null);



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
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component='div'>
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
    isLoaded && 
    <>
      <ApplicationPopUp />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PRGR ID</TableCell>
              <TableCell>PostGraduate Programme</TableCell>
              {
                auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                (
                  <>
                    <TableCell>University</TableCell>
                    <TableCell>Faculty</TableCell>
                  </>
                )
                  :
                auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                (
                  <>
                    <TableCell>Faculty</TableCell>
                  </>
                )
                  :
                  null
              }
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
                <TableCell>{pgpr.pgp?.title}</TableCell>
                {
                  auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                  (
                    <>
                      <TableCell>{pgpr.pgp?.faculty.university.name}</TableCell>
                      <TableCell>{pgpr.pgp?.faculty.name}</TableCell>
                    </>
                  )
                    :
                  auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                  (
                    <>
                      <TableCell>{pgpr.pgp?.faculty.name}</TableCell>
                    </>
                  )
                    :
                    null
                }
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
                    <Link to={`/${auth.authRole[0]}/pgprs/${pgpr?.id}/ser/${pgpr?.selfEvaluationReport?.id}`}>
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