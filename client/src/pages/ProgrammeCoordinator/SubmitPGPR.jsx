import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, Chip } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import useDrawerState from '../../hooks/useDrawerState';
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Input } from '@mui/material';
import submitSelfEvaluationReport from '../../api/SelfEvaluationReport/submitSelfEvaluationReport';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const SubmitPGPR = () => {
  const { pgprId, serId } = useParams();
  const open = useDrawerState().drawerState.open;

  const navigate = useNavigate();

  const [pgpr, setPgpr] = useState(null);

  React.useEffect(() => {
    const getPGPRData = async () => {
      try {
        const pgprResponse = await getPGPR(pgprId);

        if (pgprResponse && pgprResponse.status === 200) {
          console.log(pgprResponse.data.data);
          setPgpr(pgprResponse.data.data);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    getPGPRData();
  }, [pgprId]);





  useSetUserNavigations(
    [
      {
        name: "Dashboard",
        link: "/"
      },
      {
        name: "Postgraduate Program Reviews",
        link: `/pgprs/`
      },
      {
        name: "Self Evaluation Report",
        link: `/pgprs/${pgprId}/ser/${serId}`
      },
      {
        name: "Submit Self Evaluation Report",
        link: `/pgprs/${pgprId}/ser/${serId}/submit`
      }
    ]
  );

  let descriptionWidth = 30;

  const [expand, setexpand] = useState(8);

  let bodyHeight = open == true ? `${90 - expand}%` : `calc( ${90 - expand}% - 60px )`;
  const handleClick = () => {
    if (expand == 8) {
      setexpand(descriptionWidth);
    }
    else {
      setexpand(8);
    }
  };
  let tableHeight = expand == 8 ? {} : { height: '300px' };


  const headerRowStyle = {
    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', padding: '0 20px', fontSize: '16px', borderBottom: '1px solid #00000020'
  };

  const headerRowDivStyle = { width: '50%', textAlign: 'left' };

  const headerInfo = [
    { label: "University:", value: pgpr?.postGraduateProgramme.faculty.university.name },
    {
      label: "Faculty/Institute:", value: pgpr?.postGraduateProgramme.faculty.name,
    },
    { label: "PGPR ID:", value: 'PGPR-' + pgprId },
    { label: "Postgraduate Programme:", value: pgpr?.postGraduateProgramme.title },
    { label: "Applied Date:", value: pgpr?.postGraduateProgramReviewApplication.applicationDate },
    { label: "Requested Date:", value: pgpr?.postGraduateProgramReviewApplication.requestDate },
    { label: "Programme Coordinator:", value: pgpr?.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.initials + ' ' + pgpr?.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.surname },
  ];

  const handleSERSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    console.log(Object.fromEntries(formData));

    if (formData.get('sectionA').size === 0 || formData.get('sectionB').size === 0 || formData.get('sectionD').size === 0 || formData.get('paymentVoucher').size === 0 || formData.get('finalSerReport').size === 0) {
      setSnackbar({
        open: true,
        message: 'Please upload all the required files',
        severity: 'error',
        autoHideDuration: 3000
      });

      return;
    }

    if (formData.get('agreement') === null) {
      setSnackbar({
        open: true,
        message: 'Please confirm the agreement',
        severity: 'error',
        autoHideDuration: 3000
      });

      return;
    }

    try {

      setSnackbar({
        open: true,
        message: 'Submitting Self Evaluation Report',
        severity: 'info',
        autoHideDuration: null
      });

      const submitResponse = await submitSelfEvaluationReport(serId, formData);

      if (submitResponse && submitResponse.status === 200) {
        
        setSnackbar({
          open: true,
          message: 'Self Evaluation Report submitted successfully',
          severity: 'success',
          autoHideDuration: 3000
        });

        return;
      }
    }
    catch (error) {
      setSnackbar({
        open: true,
        message: 'Error submitting Self Evaluation Report',
        severity: 'error',
        autoHideDuration: 3000
      });


      return;
    }
  }

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
    autoHideDuration: 2000
  });


  const handleCancel = (e) => {
    navigate(`/programme_coordinator/pgprs/${pgprId}/ser/${serId}`);
  }

  return (
    <>
      <Divider textAlign='left'>
        <Chip label="Submit Self Evaluation Report" />
      </Divider>

      <Snackbar open={snackbar.open} autoHideDuration={snackbar.autoHideDuration} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>


      <DiscriptiveDiv

        width="100%"
        height="auto"
        backgroundColor="#D8E6FC"
        sx={{ marginBottom: '20px' }}
      >
        <Grid container spacing={2}>
          {headerInfo.map((infoItem, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Typography align='left' variant="subtitle1">
                <b>{infoItem.label}</b>
              </Typography>
              <Typography align='left'>{infoItem.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </DiscriptiveDiv>

      <br></br>
      <form onSubmit={handleSERSubmit}>
        <Box sx={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', my: '0.5rem' }}>
          <header style={{ fontSize: '1.5rem' }}>
            Upload the final Self Evaluation Report for Evaluation
          </header>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', my: '1rem', justifyContent: 'space-around', width: '100%' }}>
            <div>
              <label style={{ align: 'center' }}>Part A: </label>
              <Input type="file" name="sectionA" />
            </div>
            <div>
              <label>Part B: </label>
              <Input type="file" name="sectionB" />
            </div>
            <div>
              <label>Part D: </label>
              <Input type="file" name="sectionD" />
            </div>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: 'row', width: '100%', justifyContent: 'center', my: '1rem' }}>
          <Box sx={{ display: "flex", flexDirection: 'row', width: '80%', justifyContent: 'space-between', mx: '2rem' }}>
            <div>
              <label>Upload Final SER: </label>
              <Input type="file" name="finalSerReport" />
            </div>
            <br>
            </br>
            <div>
              <label>Payment Evidence: </label>
              <Input type="file" name="paymentVoucher" />
            </div>
          </Box>
        </Box>

        <br>
        </br>
        <div style={{ marginLeft: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px', }}>
            <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} id='agreement' name='agreement' />
            <label htmlFor='agreement'>I confirm that the evidences are up to date and understand that the evidences that we share will be available to the review team for evaluation</label>
          </div>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Button variant="contained" color="primary" style={{ marginRight: '10px' }} type='submit' disabled={snackbar.open}>
            Submit SER
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel} disabled={snackbar.open}>
            Go Back
          </Button>
        </div>
      </form>
    </>
  );
};

export default SubmitPGPR;
