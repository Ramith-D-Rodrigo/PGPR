import { useParams } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  InputLabel,
  TextField,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import useReviewerRole from "../../hooks/useReviewerRole";
import getAssignedPGPR from "../../api/Reviewer/getAssignedPGPR";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";

import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";

function FinalizePE() {
  const { pgprId } = useParams();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  //Set up dates for start date and end date
  const currentDate = new Date().toISOString().split("T")[0];
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const minDate = `${year}-${month}-${day}`;

  const [SERDetails, setSERDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { reviewerRole, setReviewerRole } = useReviewerRole();
  const [pgData, setPgData] = useState({});
  const [reviewers, setReviewers] = useState([]);
  const [PEData, setPEData] = useState([]);
  const [progress, setProgress] = useState([]);
  const [preliminaryData, setPreliminaryData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [openSureDialog, setOpenSureDialog] = useState(false);
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [visitStartDate, setVisitStartDate] = useState("");
  const [visitEndDate, setVisitEndDate] = useState("");
  const [evaluationStartDate, setEvaluationStartDate] = useState("");
  const [evaluationEndDate, setEvaluationEndDate] = useState("");
  const [dateRemark, setDateRemark] = useState("");

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "Proper Evaluation",
      link: "/PG_Assignments/Conduct_PE/" + pgprId,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`,
    },
    {
      name: "Finalize Proper Evaluation",
      link: "/PG_Assignments/Conduct_PE/Finalize_PE/" + pgprId,
    },
  ]);

  useEffect(() => {
    document.title = "Finalize Proper Evaluation";
    const getPGPRDetails = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await getAssignedPGPR(pgprId);
        setPgData(response?.data?.data);
        //console.log("PGPR Details : ", response?.data?.data);
        setReviewerRole(response?.data?.data?.reviewerRole);

        const pgResponse = await getPGPR(pgprId);
        const team = pgResponse?.data?.data?.acceptedReviewTeam;
        setReviewers(pgResponse?.data?.data?.acceptedReviewTeam?.reviewers);
        console.log("PGPR Details : ", pgResponse?.data?.data);

        const PEResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}review-team/proper-evaluation/view-details/${pgprId}/${team?.id}`
        );

        setPEData(PEResponse?.data?.data);
        console.log("PE Details : ", PEResponse?.data?.data);

        const serResponse = await getSelfEvaluationReport(pgprId);
        console.log("SER Details : ", serResponse?.data?.data);
        setSERDetails(serResponse?.data?.data);

        const progressResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/view-progress/${pgprId}/${pgResponse?.data?.data?.acceptedReviewTeam?.id}/${pgResponse?.data?.data?.properEvaluation?.id}`
        );
        setProgress(progressResponse?.data);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    //getSERDetails();
    getPGPRDetails();
  }, []);

  const pgProgrammeDetails =
    SERDetails?.postGraduateProgramReview?.postGraduateProgramme;
  const facultyDetails = pgProgrammeDetails?.faculty;
  const universityDetails = facultyDetails?.university;
  const pgCoordinatorDetails =
    pgProgrammeDetails?.programmeCoordinator?.academicStaff?.universitySide
      ?.user;

  const headerInfo = [
    { label: "University:", value: universityDetails?.name ?? "" },
    {
      label: "Faculty/Institute:",
      value: facultyDetails?.name ?? "",
    },
    { label: "PGPR ID:", value: `PGPR-${pgprId ?? ""}` },
    { label: "PGPR Name:", value: pgProgrammeDetails?.title ?? "" },
    { label: "Application Start Date:", value: "12/12/2020" },
    { label: "Submission Date:", value: "01/01/2021" },
    {
      label: "Program Coordinator:",
      value: `${pgCoordinatorDetails?.initials ?? ""} ${
        pgCoordinatorDetails?.surname ?? ""
      }`,
    },
  ];

  const Criterias = SERDetails?.criterias;
  // const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

  const rows = reviewers
    ? reviewers.map((reviewer, index) => {
        let total = 0;
        let completed = 0;
        const progressData = progress?.data?.[index]?.criteriaData;
        console.log("Progress Data : ", progressData);

        let progressNow = "0/0";
        if (progressData) {
          progressData.forEach((criteria) => {
            total += criteria.totalStandards || 0;
            completed += criteria.evaluatedStandards || 0;
            progressNow = `${completed}/${total}`;
            console.log("Progress Now : ", progressNow);
          });
        }

        const userData = reviewer?.userData || {};
        const id = userData.id;
        const name = userData.initials + " . " + userData.surname;
        const role =
          reviewer?.role === "CHAIR"
            ? "Review Chair Person"
            : "Review Team Member";

        const reviewerCriterias =
          PEData?.find((peData) => peData?.reviewer?.id === id)?.criteria || [];

        return {
          id,
          name,
          role,
          progressNow,
          listOfCriteria: reviewerCriterias,
        };
      })
    : [];

  console.log("Rows : ", pgData?.postGraduateReviewProgram?.properEvaluation?.id);

  const handleSetDate = async () => {
    if (
      visitStartDate === "" ||
      visitEndDate === "" ||
      evaluationStartDate === "" ||
      evaluationEndDate === ""
    ) {
      setErrorMsg("Please select required dates");
      return;
    } else if (
      visitStartDate < currentDate ||
      evaluationStartDate < currentDate ||
      visitEndDate < currentDate ||
      evaluationEndDate < currentDate
    ) {
      setErrorMsg("Dates should be after the current date");
      return;
    } else if (
      visitStartDate < evaluationStartDate ||
      visitEndDate < evaluationStartDate ||
      evaluationEndDate < evaluationStartDate
    ) {
      setErrorMsg(
        "Evaluation start date should be before the visit start date, visit end date and evaluation end date"
      );
      return;
    } else if (
      visitEndDate < visitStartDate ||
      evaluationEndDate < visitStartDate
    ) {
      setErrorMsg(
        "Visit start date should be before the visit end date and evaluation end date"
      );
      return;
    } else if (evaluationEndDate < visitEndDate) {
      setErrorMsg("Visit end date should be before the evaluation end date");
      return;
    } else {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = {
          pgprId,
          startDate: evaluationStartDate,
          siteVisitStartDate: visitStartDate,
          siteVisitEndDate: visitEndDate,
          endDate: evaluationEndDate,
          remark: dateRemark,
        };

        //console.log("Set Date data : ", data);

        await axios.get("/sanctum/csrf-cookie");
        await axios.post(
          `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/set-dates/phase-two`,
          data
        );
        setErrorMsg("Dates are set successfully");
        setSuccess(true);
        setOpenDateDialog(false);
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClickFinalizePE = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await axios.get("/sanctum/csrf-cookie");
      const data = { pgpr: pgprId };
      await axios.post(
        `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/submit`,
        data
      );
      setErrorMsg("Proper Evaluation is finalized successfully");
      setSuccess(true);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateOpen = () => {
    setOpenDateDialog(true);
  };

  const handleDateClose = () => {
    setOpenDateDialog(false);
  };

  const handleSureOpen = () => {
    setOpenSureDialog(true);
  };

  const handleSureClose = () => {
    setOpenSureDialog(false);
  };

  const handleSure = async () => {
    // setOpenSureDialog(false);
    setLoading(true);
    setErrorMsg("");
    console.log(
      "PG Data : ",
      pgData?.postGraduateReviewProgram?.properEvaluation?.id
    );
    try {
      await axios.get("/sanctum/csrf-cookie");
      const data = {
        properEvaluationId:
          pgData?.postGraduateReviewProgram?.properEvaluation?.id,
        startDate: visitStartDate,
        endDate: visitEndDate,
        status: 2,
      };
      console.log(
        "Data : ",
        pgData?.postGraduateReviewProgram?.properEvaluation?.id
      );
      await axios.put(
        `${SERVER_URL}${SERVER_API_VERSION}proper-evaluation/${pgData?.postGraduateReviewProgram?.properEvaluation?.id}`,
        data
      );
      setErrorMsg("Proper Evaluation is finalized successfully");
      setSuccess(true);
      handleDateOpen();
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    } finally {
      setLoading(false);
      handleSureClose();
    }
  };

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
                    <b>{item.label}</b>
                  </Typography>
                  <Typography align="left">{item.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DiscriptiveDiv>

          <Divider textAlign="left" sx={{ margin: "1rem 0 1rem" }}>
            <Chip label="Proper Evaluation Progress" />
          </Divider>

          <TableContainer component={Paper} style={{ height: "auto" }}>
            <Table sx={{ height: 200 }} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="left"
                  >
                    <b>Name</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Role</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Progress</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.criteria}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">{row.role}</TableCell>
                    <TableCell align="center">{row.progressNow}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
              padding: "20px 0",
              height: "auto",
            }}
          >
            {pgData?.postGraduateReviewProgram?.statusOfPgpr !== "FINAL" &&
              pgData?.postGraduateReviewProgram?.statusOfPgpr !== "COMPLETED" &&
              (pgData?.postGraduateReviewProgram?.statusOfPgpr === "PE1" ? (
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                  component={Link}
                  onClick={handleSureOpen}
                >
                  End Proper Evaluation #1
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                  onClick={handleClickFinalizePE}
                >
                  Finalize Proper Evaluation
                </Button>
              ))}
          </Box>
        </>
      )}

      <Dialog
        fullScreen={fullScreen}
        open={openSureDialog}
        onClose={handleSureClose}
        aria-labelledby="Set-Sure"
      >
        <DialogTitle id="Set-Sure-ID">
          {`Submit Proper Evaluation #1`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "space-around",
              alignItems: "left",
              width: "100%",
              height: "100%",
              margin: "1rem 0",
            }}
          >
            <Typography variant="h6">
              Are you sure you want to end Proper Evaluation #1 and start Proper
              Evaluation #2?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSureClose}>
            cancel
          </Button>
          <Button onClick={handleSure} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/*
       *  Dialog Box for Set Date
       */}
      <Dialog
        fullScreen={fullScreen}
        open={openDateDialog}
        onClose={handleDateClose}
        aria-labelledby="Set-Visit-Date"
      >
        <DialogTitle id="Set-Visit-Date-ID">
          {`Set Dates for Proper Evaluation #2`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "space-around",
              alignItems: "left",
              width: "100%",
              height: "100%",
              margin: "1rem 0",
            }}
          >
            <InputLabel htmlFor="evaluationStartDate">
              Proper Evaluation #2 Start Date
            </InputLabel>
            <TextField
              id="evaluationStartDate"
              value={evaluationStartDate}
              inputProps={{ min: minDate }}
              helperText="Please select the start date for Proper Evaluation #2"
              variant="outlined"
              onChange={(e) => setEvaluationStartDate(e.target.value)}
              type="date"
            />
            <InputLabel htmlFor="visitStartDate">Visit Start Date</InputLabel>
            <TextField
              id="visitStartDate"
              value={visitStartDate}
              inputProps={{ min: minDate }}
              helperText="Please select the start date for site visit period"
              variant="outlined"
              onChange={(e) => setVisitStartDate(e.target.value)}
              type="date"
            />
            <InputLabel htmlFor="setVisitEndDate">Visit End Date</InputLabel>
            <TextField
              id="setVisitEndDate"
              value={visitEndDate}
              inputProps={{ min: minDate }}
              helperText="Please select the end date for site visit period"
              variant="outlined"
              onChange={(e) => setVisitEndDate(e.target.value)}
              type="date"
            />
            <InputLabel htmlFor="setEvaluationEndDate">
              Proper Evaluation #2 End Date
            </InputLabel>
            <TextField
              id="seEvaluationEndDate"
              value={evaluationEndDate}
              inputProps={{ min: minDate }}
              helperText="Please select the end date for Proper Evaluation #2"
              variant="outlined"
              onChange={(e) => setEvaluationEndDate(e.target.value)}
              type="date"
            />
            <InputLabel htmlFor="dateRemarks">Remarks</InputLabel>
            <TextField
              id="dateRemarks"
              value={dateRemark}
              variant="outlined"
              onChange={(e) => setDateRemark(e.target.value)}
              type="text"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDateClose}>
            cancel
          </Button>
          <Button onClick={handleSetDate} autoFocus>
            Set Date
          </Button>
        </DialogActions>
      </Dialog>

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
}

export default FinalizePE;
