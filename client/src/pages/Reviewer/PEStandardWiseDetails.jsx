import { useEffect, useState } from "react";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";

import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import getAssignedPGPRs from "../../api/Reviewer/getAssignedPGPR";
import useAuth from "../../hooks/useAuth";

function PEStandardwiseDetails() {
  const  {auth}  = useAuth();
  const { pgprId } = useParams();
  const [assignedCriterias, setAssignedCriterias] = useState([]);
  const [selectedCriteriaId, setSelectedCriteriaId] = useState("");
  const [criteriaStandards, setCriteriaStandards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [criteriaList, setCriteriaList] = useState([]);
  const [properEvaluationId, setProperEvaluationId] = useState("");
  const [pgprData, setPgprData] = useState("");
  const [standards, setStandards] = useState([]);

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${pgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`,
    },
    {
      name: "Standard Wise Details",
      link: `/PG_Assignments/Conduct_PE/Standardwise_details/${pgprId}`,
    },
  ]); 

  useEffect(() => {
    async function getCriteriaDetails() {
      setLoading(true);
      setErrorMsg("");
      try {
        const PGresponse = await getAssignedPGPRs(pgprId);
        setPgprData(PGresponse?.data?.data); 
        // console.log("PGPR details ", PGresponse?.data?.data);
        
        setCriteriaList(
          PGresponse?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport
            ?.criterias
        );
        // console.log("Criteria List : ", criteriaList);

        setSelectedCriteriaId(
          PGresponse?.data?.data?.postGraduateReviewProgram
            ?.selfEvaluationReport?.criterias[0].id
        );

        setProperEvaluationId(
          PGresponse?.data?.data?.postGraduateReviewProgram?.properEvaluation.id
        );

        const EvalResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/display-remarks-scores?pgpr=${pgprId}&properEvaluation=${PGresponse?.data?.data?.postGraduateReviewProgram?.properEvaluation?.id}`
        );
        console.log("Eval : ", EvalResponse?.data);
        setAssignedCriterias(EvalResponse?.data);
        setCriteriaStandards(EvalResponse?.data[0]?.evaluatedStandards);
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
    getCriteriaDetails();
  }, [pgprId]);

  const getScores = async (crit) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const properScore = await axios.get(
        `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/view-scores/${pgprId}/${crit}`
      );
      setStandards(properScore?.data);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (pgprData?.role === "CHAIR") {
      getScores(selectedCriteriaId);
    }
  }, [selectedCriteriaId]);

  // console.log(" : ", selectedCriteriaId);
  // console.log("standards : ", standards);

  // console.log("Assign : ",assignedCriterias);
  // //console.log(PEData);
  // console.log("Select : ", selectedCriteriaId);
  // console.log("stan : ", criteriaStandards);

  // console.log("Role : ", pgprData?.role);

  let rows = [];
  if(pgprData?.role === "CHAIR"){
    rows = criteriaList?.map((criteria) => ({
      criteriaId: criteria?.id,
      criteriaName: criteria?.name,
      standardDetails: criteria?.standards?.map((standard) => ({
        standardId: standard?.id,
        standardName: standard?.description,
        standardNo: standard?.standardNo,
      })),
    }));
  } else {
    rows = assignedCriterias?.map((criteria, index) => ({
      criteriaId: criteria.id,
      criteriaName: criteria.criteriaName,
      criteriaScore: assignedCriterias[index]?.totalScore,
      criteriaComment: assignedCriterias[index]?.comment,
    }));
  }

  const scoreData = standards.length !== 0 ? standards?.data?.map((standard) => ({
    standardId: standard?.standardId,
    standardNo: standard?.standardNo,
    peScore: standard?.peScore,
    comment: standard?.comment,
  })) : [{}];

  // console.log("Score Data : ", scoreData);

  function findMatchingValue(standardNo) {

    const consideringStandard = scoreData.find((standard)=>standard?.standardNo == standardNo);
    // console.log(consideringStandard);
    
    return consideringStandard?? null;
  }

  // console.log("Rows : ", rows);

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            marginTop: "-10vh",
          }}
        >
          <Typography variant="h5" color="primary">
            Loading...
          </Typography>
          <CircularProgress size={50} thickness={3} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "100%",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
                margin: "10px",
              }}
            >
              <Typography
                align="center"
                fontWeight={600}
                variant="h6"
                gutterBottom
                component="div"
                style={{ marginRight: "20px" }}
              >
                Standard Wise Details of Postgraduate programme review
              </Typography>
              <FormControl
                style={{ margin: "3rem 0 2rem", width: "50%" }}
                variant="standard"
                sx={{ m: 1, minWidth: 120 }}
              >
                <InputLabel id="select-criteria">Select a Criteria to view evaluated standards details</InputLabel>
                <Select
                  labelId="select-criteria"
                  id="criteria-select"
                  value={selectedCriteriaId??""}
                  onChange={(e) => {
                    setSelectedCriteriaId(e.target.value);
                    setCriteriaStandards(
                      // rows?.[e.target.value]?.evaluatedStandards
                      rows?.find((criteria) => criteria.criteriaId == e.target.value)?.evaluatedStandards 
                    );
                  }}
                  label="criteria"
                >
                  {assignedCriterias.map((criteria, index) => (
                    <MenuItem key={index} value={criteria.criteriaId}>
                      {criteria?.criteriaName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="left"
                    >
                      <b>Standard No</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="left"
                    >
                      <b>Standard Description</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Score</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Review Comments</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows[selectedCriteriaId-1]?.standardDetails?.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">{row?.standardNo}</TableCell>
                      <TableCell align="left">{row?.standardName}</TableCell>
                      <TableCell align="center">
                        {findMatchingValue(row?.standardNo)?.peScore?? 
                        <Typography color="error">Not Evaluated</Typography>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {findMatchingValue(row?.standardNo)?.comment??
                        <Typography color="error">Not Evaluated</Typography>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{ display: "flex", justifyContent: "center", margin: "2rem" }}
            >
              <Link to={`../Summary_details/${pgprId}`}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "0 2px" }}
                >
                  View Summary Details of Criteria Wise
                </Button>
              </Link>
            </Box>
          </Box>

          <Snackbar
            open={errorMsg !== "" && !success}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => setErrorMsg("")}
          >
            <Alert onClose={() => setErrorMsg("")} severity="error">
              {errorMsg}
            </Alert>
          </Snackbar>

          <Snackbar
            open={success}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => {
              setSuccess(false);
              setErrorMsg("");
            }}
          >
            <Alert
              autoHideDuration={5000}
              onClose={() => {
                setSuccess(false);
                setErrorMsg("");
              }}
              severity="success"
            >
              {errorMsg}
              {/* on success */}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}

export default PEStandardwiseDetails;
