import React, { useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import getSpecificPGPR from '../../api/Reviewer/getSpecificPGPR';
import getSelfEvaluationReport from '../../api/SelfEvaluationReport/getSelfEvaluationReport';
import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";


function UpdateABC() {
    const {pgprId} = useParams();
    const [loading, SetLoading] = useState(false);
    const [pgprDetails, setPGPRDetails] = useState({});
    const [serDetails, setSERDetails] = useState({});
    const [reviewerRole, setReviewerRole] = useState("");
    const [serId, setSERId] = useState("");
    const navigate = useNavigate();

    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "DE",
                link: "/PG_Assignments/Conduct_DE/"+pgprId
            },
            {
                name: "Update Remarks",
                link: "/PG_Assignments/Conduct_DE/UpdateABC/"+pgprId
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
              console.log("PGPR Details : ",response1?.data);
              setPGPRDetails(response1?.data);
              setReviewerRole(response1?.data?.data?.role);
              // setSERId(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
              const response2 = await getSelfEvaluationReport(response1?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
              console.log("SER Details : ",response2?.data?.data);
              setSERDetails(response2?.data?.data);
              SetLoading(false);
          } catch (err) {
              console.error(err);
              SetLoading(false);
          }
      };
      getPGPRDetails();
    }, []);

  return (
    <DiscriptiveDiv description="Desk Evaluation"  width='100%' height="auto" backgroundColor="#D8E6FC" >
      <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-between',maxHeight:'100%',height:'100%',alignItems:'center',margin:'10px'}}>
        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',width:"100%",alignItems:"center",margin:'2rem'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Update Remarks
            </Typography>
        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section A
            </Typography>
            <a href={SERVER_URL.slice(0,-1) + serDetails.sectionA} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button></a>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section B
            </Typography>
            <a href={SERVER_URL.slice(0,-1) + serDetails.sectionB} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button> </a>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',width:"100%",alignItems:"center",margin:'1.5rem'}}>
          <Box sx={{display:'flex',flexDirection:'column',justifyContent:'flex-start',alignItems:"center",height:'100%',margin:'10px'}}>
            <Typography variant="h6" component="h2" gutterBottom>
                Section D
            </Typography>
            <a href={SERVER_URL.slice(0,-1) + serDetails.sectionD} target="_blank" rel="noreferrer" className="form-input mt-1 ml-0.5"> <Button variant="contained" color="primary">View</Button> </a>
          </Box>
            <textarea placeholder='Enter Remarks here' style={{width:"50%",height:"100px"}}></textarea>

        </Box>
      </Box>

    </DiscriptiveDiv>
  )
}

export default UpdateABC