import { SERVER_URL, SERVER_API_VERSION } from "../../assets/constants";
import React from "react";
import { useParams } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import ScrollableDiv from "../../components/ScrollableDiv";
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
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import useDrawerState from "../../hooks/useDrawerState";
import axios from "../../api/api";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import createSERRows from "../../assets/reviewer/createSERRows";

const ViewSer = () => {
  const { pgprId } = useParams();

  const [SERDetails, setSERDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "View Self Evaluation Report",
      link: "/PG_Assignments/ViewSer/" + pgprId,
    },
  ]);

  useEffect(() => {
    document.title = "View Self Evaluation Report";
    const getSERDetails = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const response = await getSelfEvaluationReport(pgprId);
        console.log("SER Details : ", response?.data?.data);
        setSERDetails(response?.data?.data);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    getSERDetails();
  }, []);

  function createData(criteriaData, submitted_standards, y1, y2, y3, y4, y5) {
    return {
      criteria: criteriaData.name,
      submitted_standards,
      y1,
      y2,
      y3,
      y4,
      y5,
    };
  }

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
    { label: "PG programme Name:", value: pgProgrammeDetails?.title ?? "" },
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
  const evidencesForGivenStandards = SERDetails?.evidenceGivenStandards;

  const rows = Criterias
    ? createSERRows(Criterias, evidencesForGivenStandards, createData)
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
          <Typography
            align="center"
            fontWeight={600}
            variant="h6"
            gutterBottom
            component="div"
            style={{ marginRight: "20px" }}
          >
            View Self Evaluation Report
          </Typography>
          <TableContainer
            component={Paper}
            style={{ height: "auto", margin: "2rem 0" }}
          >
            <Table sx={{ height: 650 }} stickyHeader aria-label="sticky table">
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
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <div
                    style={{
                      position: "absolute",
                      left: 50,
                      right: 50,
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                      Loading ...
                    </Typography>
                    <CircularProgress
                      style={{ margin: "0 0 0 20px", color: "darkblue" }}
                      thickness={5}
                      size={24}
                    />
                  </div>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      key={row.criteria}
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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

export default ViewSer;
