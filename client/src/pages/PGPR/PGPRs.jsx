import React, { useEffect } from 'react';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Modal, Typography, List, ListItem, Paper } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import getCoordinatorPGP from '../../api/ProgrammeCoordinator/getCoordinatorPGP';
import getPostGraduateProgramPGPRs from '../../api/PostGraduateProgram/getPostGraduateProgramPGPRs';
import { Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import getPGPRApplication from '../../api/PostGraduateProgramApplication/getPGPRApplication';
import { SERVER_URL } from '../../assets/constants';
import getDeanFaculty from '../../api/Dean/getDeanFaculty';
import getFacultyPostGraduatePrograms from '../../api/Faculty/getFacultyPostGraduatePrograms';
import getIQAUDirectorFaculty from '../../api/IQAUDirector/getIQAUDirectorFaculty';
import getCQADirectorUniversity from '../../api/CQADirector/getCQADirectorUniversity';
import getViceChancellorUniversity from '../../api/ViceChancellor/getViceChancellorUniversity';
import getUniversityPostGraduatePrograms from '../../api/University/getUniversityPostGraduatePrograms';
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import { styled } from '@mui/system';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const PGPRs = () => {

  const [PGPRs, setPGPRs] = React.useState([]);
  const { auth } = useAuth();

  const [isLoaded, setIsLoaded] = React.useState(false);

  document.title = "Post Graduate Programme Reviews";

  useSetUserNavigations([
    {
        name: "Dashboard",
        link: "/dashboard",
    },
    {
        name: "Postgraduate Programme Reviews",
        link: "/pgprs",
    },
]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const authRole = auth.authRole[0];
        if (authRole === 'programme_coordinator') {
          const pgpResponse = await getCoordinatorPGP(auth.id);

          if (pgpResponse && pgpResponse.status === 200) {
            console.log(pgpResponse.data.data);
            const pgprResponse = await getPostGraduateProgramPGPRs(pgpResponse.data.data.id, { includeSelfEvaluationReport: true });

            if (pgprResponse && pgprResponse.status === 200) {
              console.log(pgprResponse.data.data);

              const pgprData = pgprResponse.data.data;
              for (let i = 0; i < pgprData.length; i++) {
                pgprData[i].postGraduateProgramme = pgpResponse.data.data;
              }

              setPGPRs(pgprData);
              setIsLoaded(true);
            }
          }
        }
        else if (authRole === 'dean' || authRole === 'iqau_director') {
          let facultyResponse = null;

          if (authRole === 'dean') {
            facultyResponse = await getDeanFaculty(auth.id);
          }
          else if (authRole === 'iqau_director') {
            facultyResponse = await getIQAUDirectorFaculty(auth.id);
          }

          if (facultyResponse && facultyResponse.status === 200) {
            const facultyPGPsResponse = await getFacultyPostGraduatePrograms(facultyResponse.data.data.id);

            if (facultyPGPsResponse && facultyPGPsResponse.status === 200) {
              const pgprArr = [];
              for (let i = 0; i < facultyPGPsResponse.data.data.length; i++) {
                const pgprResponse = await getPostGraduateProgramPGPRs(facultyPGPsResponse.data.data[i].id, { includeSelfEvaluationReport: true });


                if (pgprResponse && pgprResponse.status === 200) {
                  console.log(pgprResponse.data.data);

                  const pgprData = pgprResponse.data.data;
                  for (let i = 0; i < pgprData.length; i++) {
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
        else if (authRole === 'cqa_director' || authRole === 'vice_chancellor') {
          let universityResponse = null;

          if (authRole === 'cqa_director') {
            universityResponse = await getCQADirectorUniversity(auth.id);
          }
          else if (authRole === 'vice_chancellor') {
            universityResponse = await getViceChancellorUniversity(auth.id);
          }

          if (universityResponse && universityResponse.status === 200) {
            const universityPGPsResponse = await getUniversityPostGraduatePrograms(universityResponse.data.data.id);

            if (universityPGPsResponse && universityPGPsResponse.status === 200) {
              const pgprArr = [];

              for (let i = 0; i < universityPGPsResponse.data.data.length; i++) {
                const pgprResponse = await getPostGraduateProgramPGPRs(universityPGPsResponse.data.data[i].id, { includeSelfEvaluationReport: true });

                if (pgprResponse && pgprResponse.status === 200) {
                  console.log(pgprResponse.data.data);

                  //get the faculty of the pgp
                  const facultyResponse = await getPostGraduateProgramFaculty(universityPGPsResponse.data.data[i].id);

                  if (facultyResponse && facultyResponse.status === 200) {
                    const pgprData = pgprResponse.data.data;

                    for (let j = 0; j < pgprData.length; j++) {
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
        else if (authRole === 'qac_officer' || authRole === 'qac_director') {
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
          setOpen(true);
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
    width: '30%',
    bgcolor: 'background.paper',
    borderRadius: '12px',
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
          <Typography id="modal-modal-title" variant="h6" component="h2" align='center'>
            Post Graduate Programme Review Application
          </Typography>
          <Box id="modal-modal-description" sx={{ display: 'flex', mt: 2, flexDirection: 'column' }}>
            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Application ID
              </Box>
              <Box sx={{ width: '50%' }}>
                {viewingApplicationData?.id}
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Application Status
              </Box>
              <Box sx={{ width: '50%' }}>
                {viewingApplicationData?.status.charAt(0).toUpperCase() + viewingApplicationData?.status.slice(1)}
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Request Date
              </Box>
              <Box sx={{ width: '50%' }}>
                {viewingApplicationData?.requestDate}
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Application Date
              </Box>
              <Box sx={{ width: '50%' }}>
                {viewingApplicationData?.applicationDate}
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Years
              </Box>
              <Box sx={{ width: '50%' }}>
                <Box sx={{ margin: '0.1rem' }}>
                  {viewingApplicationData?.year1}
                </Box>
                <Box sx={{ margin: '0.1rem' }}>
                  {viewingApplicationData?.year2}
                </Box>
                <Box sx={{ margin: '0.1rem' }}>
                  {viewingApplicationData?.year3}
                </Box>
                <Box sx={{ margin: '0.1rem' }}>
                  {viewingApplicationData?.year4}
                </Box>
                <Box sx={{ margin: '0.1rem' }}>
                  {viewingApplicationData?.year5}
                </Box>
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Year 5 End Date
              </Box>
              <Box sx={{ width: '50%' }}>
                {viewingApplicationData?.yEnd}
              </Box>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', margin: '0.5rem' }}>
              <Box sx={{ width: '50%' }}>
                Intent Letter
              </Box>
              <Box sx={{ width: '50%' }}>
                <a href={SERVER_URL.slice(0, -1) + viewingApplicationData?.intentLetter}>
                  <Button variant='contained'>
                    Download
                  </Button>
                </a>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    )
  }

  const CustomTable = styled(Table)((theme) => ({
    minWidth: 650,
    borderSpacing: '0 0.5rem',
    '& th': {
      backgroundColor: '#D8E6FC',
      fontWeight: 'bold',
      padding: '0.8rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
    },
    '& td': {
      padding: '1rem',
      textAlign: 'center',
      borderBottom: '1px solid #ddd',
    },
    '& tbody tr:hover': {
      backgroundColor: '#f5f5f5',
      transition: 'all 0.25s ease-in-out',
    },
  }));

  return (
    isLoaded &&
    <>
      <Divider textAlign="left">
        <Chip label="Browse Postgraduate Programme Reviews" />
      </Divider>

      <ApplicationPopUp />
      <TableContainer component={Paper} sx={{margin:'1rem 0'}}>
        <CustomTable>
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
                <TableCell>{pgpr.postGraduateProgramme?.title}</TableCell>
                {
                  auth.authRole[0] === 'qac_officer' || auth.authRole[0] === 'qac_director' ?
                    (
                      <>
                        <TableCell>{pgpr.postGraduateProgramme?.faculty.university.name}</TableCell>
                        <TableCell>{pgpr.postGraduateProgramme?.faculty.name}</TableCell>
                      </>
                    )
                    :
                    auth.authRole[0] === 'vice_chancellor' || auth.authRole[0] === 'cqa_director' ?
                      (
                        <>
                          <TableCell>{pgpr.postGraduateProgramme?.faculty.name}</TableCell>
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
        </CustomTable>
      </TableContainer>
    </>
  );
}

export default PGPRs