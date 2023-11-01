import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Divider,
  Chip,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import createSERRows from "../../assets/reviewer/createSERRows";
import getAssignedPGPRs from "../../api/Reviewer/getAssignedPGPR";

const ViewAssignedCriteria = () => {
  const { pgprId } = useParams();
  const { auth } = useAuth();

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "Proper Evaluation",
      link: `/PG_Assignments/Conduct_PE/${pgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`,
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [reviewTeam, setReviewTeam] = useState({});
  const [chairId, setChairId] = useState("");
  const [isChair, setIsChair] = useState(false);
  const [programData, setProgramData] = useState({
    title: "",
    slqfLevel: "",
    coordinator: "",
    commencementYear: "",
    faculty: "",
    university: "",
    applicationDate: "",
    requestDate: "",
    yearEnd: "",
  });
  const [PEData, setPEData] = useState([]);
  const [reviewerDetails, setReviewerDetails] = useState([]);
  const [PEProgress, setPEProgress] = useState([]);
  const [ser, setSer] = useState({});
  const [pgpr, setPgpr] = useState({});
  const [assignedRows, setAssignedRows] = useState([]);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [visitStartDate, setVisitStartDate] = useState("");
  const [visitEndDate, setVisitEndDate] = useState("");
  const [evaluationStartDate, setEvaluationStartDate] = useState("");
  const [evaluationEndDate, setEvaluationEndDate] = useState("");
  const [dateRemark, setDateRemark] = useState("");
  const [assignedPg, setAssignedPg] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const pgprResponse = await getPGPR(pgprId);
        setPgpr(pgprResponse?.data?.data);

        const response = await getAssignedPGPRs(pgprId);
        setAssignedPg(response?.data?.data);
        console.log("Assigned PGPR : ", response?.data?.data);
        //console.log("PGPR : ", pgprResponse?.data?.data);
        //setPgpr(pgprResponse?.data?.data);

        if (pgprResponse?.data?.data) {
          const team = pgprResponse?.data?.data?.acceptedReviewTeam;
          setReviewTeam(team);

          // const reviewerDetails = team?.reviewers;
          // //console.log("team : ", team);
          // setReviewers(reviewerDetails);
          // //console.log("Reviewers : ", reviewers);

          const chair = team?.reviewers?.find(
            (reviewer) => reviewer?.role === "CHAIR"
          );
          const chairReviewer = chair?.userData;
          setChairId(chairReviewer?.id);
          //console.log("Chair : ", chairReviewer?.id);
          if (chairId === auth?.id) {
            setIsChair(true);
          }

          const programApplication =
            pgprResponse?.data?.data?.postGraduateProgramReviewApplication;
          const applicationDate = programApplication?.applicationDate;
          const requestDate = programApplication?.requestDate;

          const program = pgprResponse?.data?.data?.postGraduateProgramme;
          const title = program?.title;
          const slqfLevel = program?.slqfLevel;
          const facultyData = program?.faculty;
          const faculty = facultyData?.name;
          const universityData = facultyData?.university;
          const university = universityData?.name;

          const ser = pgprResponse?.data?.data?.selfEvaluationReport;
          // setSer(pgprResponse?.data?.data?.selfEvaluationReport);
          //console.log("SER : ", ser);

          const serResponse = await getSelfEvaluationReport(
            pgprResponse?.data?.data?.selfEvaluationReport?.id
          );
          setSer(serResponse?.data?.data);
          //console.log("SER : ", serResponse?.data?.data);

          const coordinatorData = ser?.programmeCoordinator;
          const academic = coordinatorData?.academicStaff;
          const universitySideDetails = academic?.universitySide;
          const coordinatorUser = universitySideDetails?.user;
          const coordinator =
            coordinatorUser?.initials + " . " + coordinatorUser?.surname;

          //setCriteriaList(criteria);
          //console.log("Criteria List : ", criteriaList);

          setProgramData({
            title,
            slqfLevel,
            coordinator,
            faculty,
            university,
            applicationDate,
            requestDate,
          });

          //console.log("Program : ", programData);
          //console.log("Team : ", team);
          const PEResponse = await axios.get(
            `${SERVER_URL}${SERVER_API_VERSION}review-team/proper-evaluation/view-details/${pgprId}/${team?.id}`
          );
          //console.log("PE Data : ", PEResponse?.data?.data);
          setPEData(PEResponse?.data?.data);

          //console.log("Reviewer Details : ", reviewerDetails);
          // setupCriteria(PEResponse?.data?.data);

          const PEProgress = await axios.get(
            `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/view-progress?pgpr=${pgprId}&properEvaluation=${pgprResponse?.data?.data?.properEvaluation?.id}`
          );

          setPEProgress(PEProgress?.data?.data);
          //console.log("PE Progress : ", PEProgress?.data?.data);

          //console.log("Here");

          const revDetails = PEResponse?.data?.data.find(
            (PEDetail) => PEDetail.reviewer.id === auth.id
          );

          setReviewerDetails(revDetails);

          // console.log("PE : ", PEResponse?.data?.data);
        }
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Criterias = ser?.criterias;
  // const evidencesForGivenStandards = ser?.evidenceGivenStandards;

  const rows = Criterias
    ? createSERRows(ser?.criterias, ser?.evidenceGivenStandards, createData)
    : [];

  //console.log("Rows : ", rows);

  const myPE = PEData?.find((PEDetail) => PEDetail.reviewer.id === auth.id);

  //console.log("My PE : ", myPE);

  const filterData = rows?.filter((row) => {
    return myPE?.criteria.some((crit) => {
      // console.log("PE id : ", crit.id);
      // console.log("Row id : ", row.criteriaId);
      return crit.id == row.criteriaId;
    });
  });

  // console.log("Filter Data : ", filterData);

  // //setAssignedRows(filterData);
  // console.log("Here");
  // console.log("Assigned Rows : ", assignedRows);

  const headerInfo = [
    {
      title: "PGPR ID",
      value: `PGPR-${pgprId}`,
    },
    {
      title: "PG Program Name",
      value: programData.title,
    },
    {
      title: "SLQF Level",
      value: programData.slqfLevel,
    },
    {
      title: "University",
      value: programData.university,
    },
    {
      title: "Faculty/Institute",
      value: programData.faculty,
    },
    {
      title: "Program Coordinator",
      value: programData.coordinator,
    },
    {
      title: "Application Date",
      value: programData.applicationDate,
    },
    {
      title: "Submission Date",
      value: programData.requestDate,
    },
  ];

  function createData(criteriaData, submitted_standards, y1, y2, y3, y4, y5) {
    const Actions = [
      <Link key={1} to={`../${pgprId}/${criteriaData.id}`}>
        <Button
          style={{ margin: "0 8px" }}
          variant="contained"
          color="primary"
          size="small"
        >
          Evaluate
        </Button>
      </Link>,
    ];
    return {
      criteriaId: criteriaData.id,
      criteria: criteriaData.name,
      submitted_standards,
      y1,
      y2,
      y3,
      y4,
      y5,
      Actions,
    };
  }

  const finalButtons = [
    {
      title: "View Standards Wise Details of Proper Review",
      to: `../Standardwise_details/${pgprId}`,
    },
    {
      title: "View Summary Details of Criteria",
      to: `../Summary_details/${pgprId}`,
    }
  ];

  

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
          <DiscriptiveDiv
            description="PostGraduate Program Details"
            width="100%"
            height="auto"
            backgroundColor="#D8E6FC"
          >
            <Grid container spacing={2}>
              {headerInfo.map((item, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Typography align="left" variant="subtitle1">
                    <b>{item.title}</b>
                  </Typography>
                  <Typography align="left">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DiscriptiveDiv>

          <Divider textAlign="left" sx={{ margin: "1rem 0 1rem" }}>
            <Chip label="Assigned Criteria" />
          </Divider>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="left"
                  >
                    <b>Criteria</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Submitted Standards</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Evidences</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="left"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Y1</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Y2</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Y3</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Y4</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Y5</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b></b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterData?.map((row) => (
                  <TableRow
                    key={row.criteriaId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.criteria}
                    </TableCell>
                    <TableCell align="center">
                      {row.submitted_standards}
                    </TableCell>
                    <TableCell align="center">{row.y1}</TableCell>
                    <TableCell align="center">{row.y2}</TableCell>
                    <TableCell align="center">{row.y3}</TableCell>
                    <TableCell align="center">{row.y4}</TableCell>
                    <TableCell align="center">{row.y5}</TableCell>
                    <TableCell align="center">{row.Actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            spacing={2}
            sx={{ padding: { xs: "10px 0", sm: "20px 0" } }}
          >
            {finalButtons.map((buttonItem, index) => (
              <Grid item xs={12} sm={4} key={index}>
                {buttonItem.to ? (
                  <Button
                    variant="contained"
                    size="medium"
                    fullWidth
                    color="primary"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: "1rem",
                    }}
                    component={Link}
                    to={buttonItem.to}
                  >
                    {buttonItem.title}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    style={{
                      backgroundColor: "#A2CBEA",
                      color: "black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    onClick={buttonItem.onClick}
                  >
                    {buttonItem.title}
                  </Button>
                )}
              </Grid>
            ))}
            <Grid item xs={12} sm={4}>
              {chairId === auth.id ? (
                
                  <Button
                    variant="contained"
                    size="medium"
                    fullWidth
                    color="primary"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginTop: "1rem",
                    }}
                    component={Link}
                    to={`../Finalize_PE/${pgprId}`}
                  >
                    Finalize The Proper Evaluation
                  </Button>
        
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  color="primary"
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                  component={Link}
                  to={`../Submit_PE/${pgprId}`}
                >
                  Submit the Evaluated Final Results
                </Button>
              )}
            </Grid>
          </Grid>
        </>
      )}

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
    </Box>
  );
};

export default ViewAssignedCriteria;
