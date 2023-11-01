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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Divider,
  Chip,
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import { useNavigate } from "react-router-dom";

function Summary_details() {
  const { pgprId } = useParams();
  //const [reviewerId, setReviewerId] = useState("All");

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "DE",
      link: `/PG_Assignments/Conduct_DE/${pgprId}`,
    },
    {
      name: "Summary Details",
      link: `/PG_Assignments/Conduct_DE/${pgprId}/Summary_details`,
    }
  ]);


  const [scoreDetails, setScoreDetails] = useState([]);
  const [criteriaDetails, setCriteriaDetails] = useState([]);
  const [grade, setGrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function getScoreDetails() {
      setLoading(true);
      setErrorMsg("");
      try {
        const scoreResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}review-team/desk-evaluation/view-final-grades/${pgprId}?pgpr=${pgprId}`
        );
        console.log(scoreResponse?.data?.data);
        setScoreDetails(scoreResponse?.data?.data);
        if (scoreResponse?.data?.data) {
          setCriteriaDetails(scoreResponse?.data?.data?.['scores']);
          setGrade(
            scoreResponse?.data?.data?.["overallPerformanceOfStudyScore"]
          );
        }
      } catch (error) {
        setErrorMsg(error.response.data.message);
      } finally {
        setLoading(false);
      }
    }
    getScoreDetails();
  }, [pgprId]);

  const navigate = useNavigate();

  return (
    <>
      <Divider textAlign="left">
        <Chip label="Criteria Wise Summary Details of Postgraduate Programme Review" />
      </Divider>
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


          <Divider textAlign="center" sx={{m: '1rem'}}>
            <Chip label="Desk Evaluation" color="primary"/>
          </Divider>
          {/* <FormControl
            style={{ margin: "3rem", width: "70%" }}
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
          >
            <InputLabel id="select-reviewer">Reviewer</InputLabel>
            <Select
              labelId="select-reviewer"
              id="reviewer-select"
              value={reviewerId}
              onChange={(e) => setReviewerId(e.target.value)}
              label="criteria"
            >
              <MenuItem key="All" value="All">
                All
              </MenuItem>
              {ReviewerList.map((reviewer, index) => (
                <MenuItem key={index} value={reviewer}>
                  {reviewer}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </Box>

        <TableContainer component={Paper} style={{ maxHeight: "500%" }}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
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
                  <b>Maximum Raw Score</b>
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
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                    <TableCell align="center">{row.maximumCriterionScore}</TableCell>
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
                      No Data Found
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
          <Box backgroundColor="#D8E6FC" padding="0.25rem 1rem" borderRadius="0.5rem">
            <Typography variant="h6" component="h2" gutterBottom>
              Desk Evaluation Grade : {grade}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "0 10px" }}
            onClick={()=> 
              navigate(`/reviewer/PG_Assignments/Conduct_DE/Submit_DE/${pgprId}`)
            }
          >
            Submit the Desk Evaluation
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Summary_details;
