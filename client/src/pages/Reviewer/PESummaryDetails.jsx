import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";

function PESummaryDetails() {
  const { pgprId } = useParams();
  //const [reviewerId, setReviewerId] = useState("All");

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
    {
      name: "Summary Details",
      link: `/PG_Assignments/Conduct_PE/Summary_details/${pgprId}`,
    }
  ]);

  const [scoreDetails, setScoreDetails] = useState([]);
  const [criteriaDetails, setCriteriaDetails] = useState([]);
  const [grade, setGrade] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getScoreDetails() {
      setLoading(true);
      setErrorMsg("");
      try {
        const scoreResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}review-team/proper-evaluation/view-final-grades/${pgprId}?pgpr=${pgprId}`
        );
        
        setScoreDetails(scoreResponse?.data?.data);
        if (scoreResponse?.data?.data){
          setCriteriaDetails(scoreResponse?.data?.data?.['scores']);
          setGrade(
            scoreResponse?.data?.data?.["overallPerformanceOfStudyScore"]
          );
        }
        // console.log(scoreResponse?.data?.data);
      } catch (error) {
        setErrorMsg(error.response.data.error);
      } finally {
        setLoading(false);
      }
    }
    getScoreDetails();
  }, [pgprId]);

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
              height: "100%",
              alignItems: "center",
              margin: "2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Typography
                align="center"
                fontWeight={600}
                variant="h6"
                gutterBottom
                component="div"
                style={{ marginRight: "2rem" }}
              >
                Criteria Wise Summary Details of Postgraduate programme review
              </Typography>
              <Typography variant="subtitle-1" gutterBottom>
                Proper Evaluation
              </Typography>
            </Box>

            <TableContainer component={Paper} style={{ maxHeight: "500%" }}>
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
                      <b>Criteria ID</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Criteria Name</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Weightage on 1000 scale</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Minimum Weighted Score</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Raw Score</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Maximum Score</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Actual Score</b>
                    </TableCell>
                    <TableCell
                      style={{ backgroundColor: "#D8E6FC" }}
                      align="center"
                    >
                      <b>Pass/Fail</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {criteriaDetails && criteriaDetails.length > 0 ? (
                    criteriaDetails.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="left">{row.criteriaId}</TableCell>
                        <TableCell align="center">{row.criteriaName}</TableCell>
                        <TableCell align="center">
                          {row.weightageOnThousand}
                        </TableCell>
                        <TableCell align="center">
                          {row.minimumCriterionScore}
                        </TableCell>
                        <TableCell align="center">{row.rawScore}</TableCell>
                        <TableCell align="center">
                          {row.maximumCriterionScore}
                        </TableCell>
                        <TableCell align="center">{row.actualScore}</TableCell>
                        <TableCell align="center">
                          <span
                            style={{
                              color:
                                row.isActualCriterionWiseScoreIsLessThanMinCriterionScore
                                  ? "red"
                                  : "green",
                            }}
                          >
                            {row.isActualCriterionWiseScoreIsLessThanMinCriterionScore
                              ? "Fail"
                              : "Pass"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      textalign="center"
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell colSpan={7}>
                        <Typography
                          variant="h6"
                          align="center"
                          sx={{ mt: 5, mb: 5 }}
                        >
                          Summary Detailed score will be available after evaluated all the criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginY: "3rem",
                width: "100%",
              }}
            >
              <Box
                backgroundColor="#D8E6FC"
                padding="0.25rem 1rem"
                borderRadius="0.5rem"
              >
                <Typography variant="h6" component="h2" gutterBottom>
                  {
                  criteriaDetails && criteriaDetails.length > 0? 
                    "Proper Evaluation Score : "+ {grade}
                    : 
                    "Proper Evaluation Score : Not Available Yet"
                  }
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "0 10px" }}
                disabled={criteriaDetails && criteriaDetails.length > 0 ? false : true}
                onClick={() => {
                  const targetUrl = `../Submit_PE/${pgprId}`;
                  //console.log("Navigating to:", targetUrl);
                  window.location.href = targetUrl;
                }}
              >
                Submit the Proper Evaluation
              </Button>
            </Box>
          </Box>
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
}

export default PESummaryDetails;
