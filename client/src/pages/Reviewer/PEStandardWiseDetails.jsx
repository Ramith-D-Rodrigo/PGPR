import { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";

import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";

function PEStandardwiseDetails() {
  const { pgprId } = useParams();
  const [assignedCriterias, setAssignedCriterias] = useState([]);
  const [criteriaId, setCriteriaId] = useState(0);

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

  // const criteriaStandards = useMemo(() => [
  //   {
  //     criteriaName: "Programme Management",
  //     standards: [
  //       {
  //         no: 1.1,
  //         score: 2,
  //         review_comments: "Good justification and evidences",
  //       },
  //       {
  //         no: 1.2,
  //         score: 3,
  //         review_comments: "Very good justification and evidences",
  //       },
  //       {
  //         no: 1.3,
  //         score: 4,
  //         review_comments: "Excellent justification and evidences",
  //       },
  //     ],
  //   },
  //   {
  //     criteriaName: "P. Design and Development",
  //     standards: [
  //       {
  //         no: 2.1,
  //         score: 3,
  //         review_comments: "Very good design and development",
  //       },
  //       {
  //         no: 2.2,
  //         score: 4,
  //         review_comments: "Excellent design and development",
  //       },
  //       {
  //         no: 2.3,
  //         score: 2,
  //         review_comments: "Satisfactory design and development",
  //       },
  //     ],
  //   },
  //   {
  //     criteriaName: "Human Physical Res. & LS",
  //     standards: [
  //       {
  //         no: 3.1,
  //         score: 4,
  //         review_comments: "Excellent resources and facilities",
  //       },
  //       {
  //         no: 3.2,
  //         score: 3,
  //         review_comments: "Very good resources and facilities",
  //       },
  //       {
  //         no: 3.3,
  //         score: 2,
  //         review_comments: "Satisfactory resources and facilities",
  //       },
  //     ],
  //   },
  // ], []);

  const [standards, setStandards] = useState(criteriaStandards[0].standards);

  useEffect(() => {
    setStandards(criteriaStandards[criteriaId].standards);
  }, [criteriaId, criteriaStandards]);

  async function getCriteriaDetails(criteriaId) {
    try {
      const response = await axios.get(
        `${SERVER_URL}/${SERVER_API_VERSION}reviewer/view/own-proper-evaluation-criteria/${pgprId}/criteria/${criteriaId}`
      );
      const responseData = await response.json();
      setStandards(responseData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
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
            <InputLabel id="select-criteria">Criteria</InputLabel>
            <Select
              labelId="select-criteria"
              id="criteria-select"
              value={criteriaId}
              onChange={(e) => {
                setCriteriaId(e.target.value);
                getCriteriaDetails(criteriaId);
              }}
              label="criteria"
            >
              {criteriaStandards.map((criteria, index) => (
                <MenuItem key={index} value={index}>
                  {criteria.criteriaName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
                  <b>Standard No</b>
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
              {standards.map((standard, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{standard.no}</TableCell>
                  <TableCell align="center">{standard.score}</TableCell>
                  <TableCell align="center">
                    {standard.review_comments}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
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
    </>
  );
}

export default PEStandardwiseDetails;
