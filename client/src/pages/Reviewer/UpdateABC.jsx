import React, { useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress , Box, Typography, Snackbar } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';
import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import getReviewerRemarksForSERSections from '../../api/Reviewer/getReviewerRemarksForSERSections';
import Alert from '@mui/material/Alert';
import updateRemarksOfSERSections from '../../api/Reviewer/updateRemarksOfSERSections';


function UpdateABC() {
  const { pgprId, serId } = useParams();
  const [loading, SetLoading] = useState(false);
  const [pgprDetails, setPGPRDetails] = useState({});
  const [serDetails, setSERDetails] = useState({});
  const [reviewerRole, setReviewerRole] = useState("");
  const navigate = useNavigate();
  const [sectionA, setSectionA] = useState("");
  const [sectionB, setSectionB] = useState("");
  const [sectionD, setSectionD] = useState("");

  const [sectionARemark, setSectionARemark] = useState("");
  const [sectionBRemark, setSectionBRemark] = useState("");
  const [sectionDRemark, setSectionDRemark] = useState("");

  useSetUserNavigations(
    [
      {
        name: "PG Assignments",
        link: "/PG_Assignments"
      },
      {
        name: "DE",
        link: "/PG_Assignments/Conduct_DE/" + pgprId
      },
      {
        name: "Update Remarks",
        link: "/PG_Assignments/Conduct_DE/UpdateABC/" + pgprId
      },
    ]
  );

  useEffect(() => {
    document.title = "Update Remarks";
    // get section A , B , D 
    const getPGPRDetails = async () => {
      SetLoading(true);
      try {
        const response1 = await getSpecificPGPR(pgprId);
        console.log("PGPR Details : ", response1?.data);
        setPGPRDetails(response1?.data);
        setReviewerRole(response1?.data?.data?.role);
        // setSERId(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
        const response2 = await getSelfEvaluationReport(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
        console.log("SER Details : ", response2?.data?.data);
        setSERDetails(response2?.data?.data);

        //get the remarks for the sections
        const response3 = await getReviewerRemarksForSERSections(serId);
        if (response3) {
          console.log("Reviewer Remarks : ", response3?.data?.data);

          const data = response3?.data?.data;

          if(data.remarks.length === 0){
            setSectionARemark("");
            setSectionBRemark("");
            setSectionDRemark("");
          }
          else{
            setSectionARemark(data?.remarks?.filter(item => item.section === 'A')[0]?.remark);
            setSectionBRemark(data?.remarks?.filter(item => item.section === 'B')[0]?.remark);
            setSectionDRemark(data?.remarks?.filter(item => item.section === 'D')[0]?.remark);

          }

        }


        SetLoading(false);
      } catch (err) {
        console.log(err);
        SetLoading(false);
      }
    };
    getPGPRDetails();
  }, []);

  const updateRemarkForA = async () => {
    const request = {
      selfEvaluationReportId: serId,
      sections: [
        {
          section: 'A',
          remark: sectionARemark
        }
      ]
    }

    await updateRemark(request);
  }

  const updateRemarkForB = async () => {
    const request = {
      selfEvaluationReportId: serId,
      sections: [
        {
          section: 'B',
          remark: sectionBRemark
        }
      ]
    }

    await updateRemark(request);
  }

  const updateRemarkForD = async () => {
    const request = {
      selfEvaluationReportId: serId,
      sections: [
        {
          section: 'D',
          remark: sectionDRemark
        }
      ]
    }

    await updateRemark(request);
  }

  const updateRemark = async (remarkRequest) => {
    try {
      SetLoading(true);
      const response = await updateRemarksOfSERSections(remarkRequest);

      if(response && response.status === 200){
        setSnackbar({
          open: true,
          message: "Remarks Updated Successfully",
          severity: "success"
        });
      }
      else{
        setSnackbar({
          open: true,
          message: "Error Updating Remarks",
          severity: "error"
        });
      }
      SetLoading(false);

    }
    catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: error.response.data.message,
        severity: "error"
      });
      SetLoading(false);

    }
  }



  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  return (
    <>
    {
      loading? 
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <CircularProgress
        style={{ margin: "0 0 0 20px", color: "darkblue" }}
        thickness={5}
        size={32}
        />
      </div>
      :
      <>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <DiscriptiveDiv description="Desk Evaluation" width='100%' height="auto" backgroundColor="#D8E6FC" >
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', maxHeight: '100%', height: '100%', alignItems: 'center', margin: '10px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: "100%", alignItems: "center", margin: '2rem' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Update Remarks
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", alignItems: "flex-start", margin: '1.5rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", height: '100%', margin: '0 10px' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Section A
              </Typography>
              <a href={SERVER_URL.slice(0, -1) + serDetails.sectionA} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button></a>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-end", width: '100%' }}>
              <textarea onChange={(e) => setSectionARemark(e.target.value)} value={sectionARemark} placeholder='Enter Remarks here' style={{ width: "70%", height: "100px", margin: '0 0 0.5rem' }}></textarea>
              <Button{...{disabled:loading}} variant="contained" color="primary" onClick={() => updateRemarkForA()}>Update</Button>
            </Box>

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", alignItems: "flex-start", margin: '1.5rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", height: '100%', margin: '0 10px' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Section B
              </Typography>
              <a href={SERVER_URL.slice(0, -1) + serDetails.sectionB} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button> </a>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-end", width: '100%' }}>
              <textarea onChange={(e) => setSectionBRemark(e.target.value)} value={sectionBRemark} placeholder='Enter Remarks here' style={{ width: "70%", height: "100px", margin: '0 0 0.5rem' }}></textarea>
              <Button{...{disabled:loading}} variant="contained" color="primary" onClick={() => updateRemarkForB()}>Update</Button>
            </Box>

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: "100%", alignItems: "flex-start", margin: '1.5rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", height: '100%', margin: '0 10px' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Section D
              </Typography>
              <a href={SERVER_URL.slice(0, -1) + serDetails.sectionD} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button> </a>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-end", width: '100%' }}>
              <textarea onChange={(e) => setSectionDRemark(e.target.value)} value={sectionDRemark} placeholder='Enter Remarks here' style={{ width: "70%", height: "100px", margin: '0 0 0.5rem' }}></textarea>
              <Button{...{disabled:loading}} variant="contained" color="primary" onClick={() => updateRemarkForD()}>Update</Button>
            </Box>

          </Box>
        </Box>

      </DiscriptiveDiv>
      </>
    }
    </>


  )
}

export default UpdateABC