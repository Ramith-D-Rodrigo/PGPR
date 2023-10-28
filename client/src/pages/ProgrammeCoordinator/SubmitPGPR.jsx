import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import useDrawerState from '../../hooks/useDrawerState';
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Input } from '@mui/material';
import submitSelfEvaluationReport from '../../api/SelfEvaluationReport/submitSelfEvaluationReport';

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
        name: "PG Assignments",
        link: "/PG_Assignments"
      },
      {
        name: "Self Evaluation Report",
        link: "/PG_Assignments/SubmitPGPR/"
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

    if(formData.get('sectionA').size === 0 || formData.get('sectionB').size === 0 || formData.get('sectionD').size === 0 || formData.get('paymentVoucher').size === 0 || formData.get('finalSerReport').size === 0){
      alert('please upload the required files');
      return;
    }

    if(formData.get('agreement') === null){
      alert('you must check the agreement');
      return;
    }

    try{
      const submitResponse = await submitSelfEvaluationReport(serId, formData);

      if(submitResponse && submitResponse.status === 200){
        alert(submitResponse.data.message);
        return;
      }
    }
    catch(error){
      console.log(error.message);
      return;
    }
  }

  const handleCancel = (e) => {
    navigate(`/programme_coordinator/pgprs/${pgprId}/ser/${serId}`);
  }

  return (
    <>

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
        <div style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline' }}>
          <header style={{ fontSize: '15px' }}>
            Upload the final SER Report for Evaluation
          </header>
        </div>
        <br>
        </br>
        <div style={{ marginLeft: '200px', display: 'flex', flexDirection: 'row' }}>
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
        </div>
        <br>
        </br>
        <div style={{ marginLeft: '345px' }}>
          <label>Upload Final SER: </label>
          <Input type="file" name="finalSerReport" />
        </div>
        <br>
        </br>
        <div style={{ marginLeft: '340px' }}>
          <label>Payment Evidence: </label>
          <Input type="file" name="paymentVoucher" />
        </div>
        <br>
        </br>
        <div style={{ marginLeft: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px', }}>
            <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} id='agreement' name='agreement' />
            <label htmlFor='agreement'>I confirm that the evidences are up to date and consent to be shared with the review team</label>
          </div>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <Button variant="contained" color="error" style={{ marginRight: '10px' }} type='submit'>
            Submit SER
          </Button>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default SubmitPGPR;
