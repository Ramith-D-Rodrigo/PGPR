import { useState } from "react";
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
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";

function Summary_details() {
  const { pgprId } = useParams();
  const [reviewerId, setReviewerId] = useState("All");

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
      name: "Summary Details",
      link: `/PG_Assignments/Conduct_PE/Summary_details/${pgprId}`,
    }
  ]);

  const rows = [
    {
      id: 1,
      criterianWiseScore: 89,
      maxRowScore: 100,
      weightageOn1000Scale: 889,
      weightageOnMinScore: 89,
      actualCriteriaStore: 89,
      condition: "Yes",
      reviewer: "Reviewer 1",
    },
    {
      id: 2,
      criterianWiseScore: 89,
      maxRowScore: 100,
      weightageOn1000Scale: 889,
      weightageOnMinScore: 89,
      actualCriteriaStore: 89,
      condition: "Yes",
      reviewer: "Reviewer 2",
    },
    {
      id: 3,
      criterianWiseScore: 89,
      maxRowScore: 100,
      weightageOn1000Scale: 889,
      weightageOnMinScore: 89,
      actualCriteriaStore: 89,
      condition: "Yes",
      reviewer: "Reviewer 3",
    },
    {
      id: 4,
      criterianWiseScore: 89,
      maxRowScore: 100,
      weightageOn1000Scale: 889,
      weightageOnMinScore: 89,
      actualCriteriaStore: 89,
      condition: "Yes",
      reviewer: "Reviewer 1",
    },
    {
      id: 5,
      criterianWiseScore: 89,
      maxRowScore: 100,
      weightageOn1000Scale: 889,
      weightageOnMinScore: 89,
      actualCriteriaStore: 89,
      condition: "Yes",
      reviewer: "Reviewer 2",
    },
  ];

  const ReviewerList = ["Reviewer 1", "Reviewer 2", "Reviewer 3"];

  const filteredRows = () => {
    if (reviewerId === "All") {
      return rows; // Show all criteria when "All" is selected
    }
    return rows.filter((row) => row.reviewer === reviewerId);
  };

  return (
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
          <Typography variant="body2" component="h2" gutterBottom>
            Proper Evaluation
          </Typography>
          <FormControl
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
          </FormControl>
        </Box>

        <TableContainer component={Paper} style={{ maxHeight: "500%" }}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
                  <b>Criteria No</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Row Criterian Wise-Score</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Max Row Score</b>
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
                  <b>Weightage on Minimum Score</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Actual Criteria Wise Score</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Condition (Yes/No)</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows().map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="center">{row.criterianWiseScore}</TableCell>
                  <TableCell align="center">{row.maxRowScore}</TableCell>
                  <TableCell align="center">
                    {row.weightageOn1000Scale}
                  </TableCell>
                  <TableCell align="center">
                    {row.weightageOnMinScore}
                  </TableCell>
                  <TableCell align="center">
                    {row.actualCriteriaStore}
                  </TableCell>
                  <TableCell align="center">{row.condition}</TableCell>
                </TableRow>
              ))}
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
          <Typography variant="h6" component="h2" gutterBottom>
            Proper Evaluation Score : D
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "0 10px" }}
          >
            Submit the Proper Evaluation
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default Summary_details;
