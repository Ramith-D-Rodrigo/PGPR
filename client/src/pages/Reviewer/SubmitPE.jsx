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
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import getAssignedPGPR from "../../api/Reviewer/getAssignedPGPR";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";

const SubmitPE = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { pgprId } = useParams();
  const [SERDetails, setSERDetails] = useState([]);
  const [criteriaList, setCriteriaList] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reviewerRole, setReviewerRole] = useState("");
  const [properEvaluation, setProperEvaluation] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [serId, setSerId] = useState("");
  const [success, setSuccess] = useState(false);

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
      name: "Submit PE",
      link: "/PG_Assignments/Conduct_PE/Submit_PE/" + pgprId,
    },
  ]);

  useEffect(() => {
    document.title = "Submit Proper Evaluation";
    const getPGPRDetails = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await getAssignedPGPR(pgprId);
        //console.log("PGPR Details : ", response?.data?.data);
        setReviewerRole(response?.data?.data?.role);
        setProperEvaluation(
          response?.data?.data?.postGraduateReviewProgram?.properEvaluation?.id
        );
        setSerId(
          response?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport
            ?.id
        );
        // console.log(
        //   "Proper Evaluation : ",
        //   response?.data?.data?.postGraduateReviewProgram?.properEvaluation?.id
        // );
        // console.log("Reviewer Role : ", response?.data?.data?.role);
        if (response?.data?.data) {
          const response = await getSelfEvaluationReport(serId);
          //console.log("SER Details : ", response?.data?.data);
          setSERDetails(response?.data?.data);
          setCriteriaList(response?.data?.data?.criterias);
        }
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getPGPRDetails();
  }, [pgprId, serId]);

  useEffect(() => {
    async function getProgressDetails() {
      setLoading(true);
      setErrorMsg("");
      try {
        if (properEvaluation === "") return;
        const response = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/view-progress?pgpr=${pgprId}&properEvaluation=${properEvaluation}`
        );
        setProgressList(response?.data?.data);
        //console.log("PGPR : ", response?.data?.data);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
    getProgressDetails();
  }, [pgprId, properEvaluation]);

  const handleSubmitPE_results = async () => {
    setLoading(true);
    setErrorMsg("");
    try{
      const data = {
        properEvaluation: properEvaluation,
      };
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(
        `${SERVER_URL}${SERVER_API_VERSION}reviewer/submit/proper-evaluation`,
        data
      );
      setErrorMsg("Proper Evaluation Results Submitted Successfully");
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
    setOpenDialog(false);
  };

  const pgProgrammeDetails =
    SERDetails?.postGraduateProgramReview?.postGraduateProgramme;
  const facultyDetails = pgProgrammeDetails?.faculty;
  const universityDetails = facultyDetails?.university;
  const pgCoordinatorDetails =
    pgProgrammeDetails?.programmeCoordinator?.academicStaff?.universitySide
      ?.user;
  const headerInfo = [
    { label: "PGPR ID:", value: `PGPR-${pgprId ?? ""}` },
    { label: "PG Program Name:", value: pgProgrammeDetails?.title ?? "" },
    { label: "University:", value: universityDetails?.name ?? "" },
    {
      label: "Faculty/Institute:",
      value: facultyDetails?.name ?? "",
    },
    {
      label: "Program Coordinator:",
      value: `${pgCoordinatorDetails?.initials ?? ""} ${
        pgCoordinatorDetails?.surname ?? ""
      }`,
    },
    { label: "Application Start Date:", value: "12/12/2020" },
    { label: "Submission Date:", value: "01/01/2021" },
  ];

  function createData(
    criteriaName,
    totalStandards,
    evaluatedStandards,
    actions
  ) {
    const progressValue = `${evaluatedStandards}/${totalStandards}`;
    actions = actions.map((action, index) => {
      let allow = action.allow ? { disabled: false } : { disabled: true };
      allow = loading ? { disabled: true } : allow;
      return (
        <Link key={index} to={action.allow ? action.link : ""}>
          <Button
            {...allow}
            style={{ margin: "0 8px" }}
            variant="contained"
            color="primary"
            size="small"
          >
            {action.action}
          </Button>
        </Link>
      );
    });

    return {
      criteriaName,
      progressValue,
      actions,
    };
  }

  const rows =
    progressList.length > 0
      ? progressList.map((progress) => {
          const criteriaId = progress?.criteriaId;
          const criteriaName = progress?.criteriaName;
          const totalStandards = progress?.totalStandards;
          const evaluatedStandards = progress?.evaluatedStandards;
          const actions = [
            {
              action: "Update",
              allow: true,
              link: `../${pgprId}/${criteriaId}`,
            },
          ];
          return createData(
            criteriaName,
            totalStandards,
            evaluatedStandards,
            actions
          );
        })
      : [];

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
              {headerInfo.map((infoItem, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Typography align="left" variant="subtitle1">
                    <b>{infoItem.label}</b>
                  </Typography>
                  <Typography align="left">{infoItem.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </DiscriptiveDiv>

          <Divider style={{ margin: "1rem 0 1rem" }} textAlign="left">
            <Chip label="Proper Evaluation Progress" />
          </Divider>

          <TableContainer component={Paper} style={{ height: "auto" }}>
            <Table
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow sx={{ "&:last-child th": { border: 0 } }}>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="left"
                  >
                    <b>Criteria Name</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Proper Evaluation Progress</b>
                  </TableCell>
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.criteriaName}</TableCell>
                      <TableCell align="center">{row.progressValue}</TableCell>
                      <TableCell align="center">{row.actions}</TableCell>
                    </TableRow>
                  ))
                }
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
            <Button
              onClick={() => setOpenDialog(true)}
              variant="contained"
              size="medium"
              color="primary"
            >
              Submit The Proper Evaluation Results
            </Button>
          </Box>

          <Dialog
            fullScreen={fullScreen}
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="submit-PE_results"
          >
            <DialogTitle id="submit-PE_results_ID">
              {
                "Are you sure that you want to Submit the Proper Evaluation Results?"
              }
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Once you Submit the Proper Evaluation Results, you can&apos;t
                undo this action.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => setOpenDialog(false)}>
                cancel
              </Button>
              <Button onClick={() => handleSubmitPE_results()} autoFocus>
                Submit
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
        </>
      )}
    </Box>
  );
};

export default SubmitPE;
