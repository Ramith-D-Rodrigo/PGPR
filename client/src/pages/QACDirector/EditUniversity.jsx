import React, { useEffect, useState } from 'react'
import getAUniversity from '../../api/University/getAUniversity';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Box, Button, Chip, CircularProgress, Divider, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import getCurrentDean from '../../api/Faculty/getCurrentDean';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import { Alert, Snackbar } from '@mui/material';
import removeViceChancellorRole from '../../api/ViceChancellor/removeViceChancellorRole';
import removeCQADirectorRole from '../../api/CQADirector/removeCQADirectorRole';


const EditUniversity = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [university, setUniversity] = useState(null);

  const { auth } = useAuth();

  const navigator = useNavigate();

  useSetUserNavigations(
    [{
      name: "Dashboard",
      link: "/"
    },
    {
      name: "Universities",
      link: "/universities"
    },
    {
      name: "Edit University",
      link: "/universities/edit" + id
    },
    ]
  );

  useEffect(() => {

    document.title = 'Edit University'

    const handleGetUniversity = async () => {

      setLoading(true);

      try {

        const queryParams = {
          'includeCQA': true,
          'includeViceChancellor': true,
          'includeUniversitySide': true,
          'includeUser': true,
        }

        console.log(id);
        const result = await getAUniversity(id, queryParams);

        console.log(result.data.data);


        setUniversity(result.data.data);
      }
      catch (err) {
        console.log(err.response.data);
      }

      setLoading(false);
    }

    handleGetUniversity();
  }, [id]);

  const styled = {
    display: 'flex',
    width: '80%',
    margin: '0.6rem',
  }

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [wait, setWait] = useState(false);



  const removeViceChancellor = async () => {
    setWait(true);
    try {
      const result = await removeViceChancellorRole(university.viceChancellor.universitySide.user.id);

      if(result.status === 200){
        setUniversity({...university, viceChancellor: null});
        setWait(false);
        setSuccessMsg("Successfully Removed Vice Chancellor");
      }
    }
    catch (err) {
      console.log(err.response.data);
      setWait(false);
      setErrorMsg(err.response.data.message);
    }
  }

  const removeCQADirector = async () => {
    setWait(true);
    try {
      const result = await removeCQADirectorRole(university.centerForQualityAssurance?.currentCQADirector.qualityAssuranceStaff.universitySide.user.id);

      if(result.status === 200){
        setUniversity({...university, centerForQualityAssurance: {...university.centerForQualityAssurance, currentCQADirector: null}});
        setWait(false);
        setSuccessMsg("Successfully Removed CQA Director");
      }
    }
    catch (err) {
      console.log(err.response.data);
      setWait(false);
      setErrorMsg(err.response.data.message);
    }
  }

    return (
      <>
        <Snackbar
          open={errorMsg == "" ? false : true}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={() => setErrorMsg("")}
        >
          <Alert onClose={() => setErrorMsg("")} severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={successMsg == "" ? false : true}
          autoHideDuration={1500}
          onClose={() => setSuccessMsg("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={() => setSuccessMsg("")} severity="success">
            {successMsg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={wait}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="info">
            Please wait...
          </Alert>
        </Snackbar>
        <Divider textAlign='left' sx={{ mb: 2 }}>
          <Chip label="Edit University" />
        </Divider>

        {loading &&
          <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
              Loading Data...
            </Typography>
            <CircularProgress
              style={{ margin: "0 0 0 20px", color: "darkblue" }}
              thickness={5}
              size={24}
            />
          </div>
        }
        {!loading && university &&
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  University
                </Typography>
                <Typography sx={{ width: '50%' }}>
                  {university.name}
                </Typography>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Address
                </Typography>
                <Typography sx={{ width: '50%' }}>
                  {university.address}
                </Typography>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Contact Numbers
                </Typography>
                <Select defaultValue={university.contactNo.data[0]} sx={{ minWidth: '50%' }}>
                  {university.contactNo.data.map((contactNo) => (
                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Fax Numbers
                </Typography>
                <Select defaultValue={university.faxNo.data[0]} sx={{ minWidth: '50%' }}>
                  {university.faxNo.data.map((faxNo) => (
                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Current Vice Chancellor
                </Typography>
                <Typography sx={{ width: '50%' }}>
                  {
                    university.viceChancellor ?
                      <>
                        {
                          university.viceChancellor.universitySide.user.initials + " " + university.viceChancellor.universitySide.user.surname

                        }
                        <Button variant="contained" sx={{ mx: '0.5rem' }} color="error" disabled={wait} onClick={() => removeViceChancellor()}>
                          Remove Vice Chancellor
                        </Button>
                      </>
                      :
                      <>
                        Not Assigned
                        <Button variant="contained" sx={{ mx: '0.5rem' }} color="primary" disabled={wait} onClick={() => {
                          //navigate to create account page
                          navigator(`/${auth.authRole[0]}/createAccounts`);
                        }}>
                          Create an Account for Vice Chancellor
                        </Button>
                      </>
                  }
                  {

                  }
                </Typography>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Website
                </Typography>
                <Button>
                  <a href={university.website} target="_blank" rel="noreferrer">
                    View Website
                  </a>
                </Button>
              </Box>

              <Divider sx={{ width: '80%', my: 2 }}>
                <Chip label="Center For Quality Assurance" color='primary' />
              </Divider>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Email
                </Typography>
                <Typography sx={{ width: '50%' }}>
                  {university.centerForQualityAssurance.email}
                </Typography>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Contact Numbers
                </Typography>
                <Select defaultValue={university.centerForQualityAssurance.contactNo[0]} sx={{ minWidth: '50%' }}>
                  {university.centerForQualityAssurance.contactNo.data.map((contactNo) => (
                    <MenuItem key={contactNo} value={contactNo}>{contactNo}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Fax Numbers
                </Typography>
                <Select defaultValue={university.centerForQualityAssurance.faxNo[0]} sx={{ minWidth: '50%' }}>
                  {university.centerForQualityAssurance.faxNo.data.map((faxNo) => (
                    <MenuItem key={faxNo} value={faxNo}>{faxNo}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={styled}>
                <Typography sx={{ width: '50%' }}>
                  Current Center For Quality Assurance Director
                </Typography>
                <Typography sx={{ width: '50%' }}>
                  {
                    university.centerForQualityAssurance?.currentCQADirector ?
                      <>
                        {
                          university.centerForQualityAssurance?.currentCQADirector.qualityAssuranceStaff.universitySide.user.initials + " " + university.centerForQualityAssurance?.currentCQADirector.qualityAssuranceStaff.universitySide.user.surname
                        }
                        <Button variant="contained" sx={{ mx: '0.5rem' }} color="error" disabled={wait} onClick={() => removeCQADirector()}>
                          Remove CQA Director
                        </Button>


                      </>
                      :
                      <>
                        Not Assigned
                        <Button variant="contained" sx={{ mx: '0.5rem' }} color="primary" onClick={() => {
                          //navigate to create account page
                          navigator(`/${auth.authRole[0]}/createAccounts`);
                        }}>
                          Create an Account for CQA Director
                        </Button>
                      </>
                  }
                </Typography>
              </Box>
            </Box>

          </>
        }
      </>
    )
  }

  export default EditUniversity