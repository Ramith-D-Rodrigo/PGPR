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
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(0);
  const [criteriaStandards, setCriteriaStandards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
        const PEResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}proper-evaluation/${pgprId}`
        );
        // console.log(PEResponse?.data?.data);
        if (PEResponse?.data?.data) {
          const response = await axios.get(
            `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/display-remarks-scores?pgpr=${pgprId}&properEvaluation=${PEResponse?.data?.data?.id}`,
          );
          setAssignedCriterias(response?.data);
          setSelectedCriteriaId(response?.data[0]?.criteriaId);
          setCriteriaStandards(response?.data[0]?.evaluatedStandards);
          //console.log(response?.data);
        }
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
    getCriteriaDetails();
  }, [pgprId]);

  //console.log(assignedCriterias);
  // console.log(PEData);
  // console.log(selectedCriteriaId);
  //console.log(criteriaStandards);

  return (
    <>
      {loading ? (
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Loading...
        </Typography>
      ) : errorMsg ? (
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          {errorMsg}
        </Typography>
      ) : (
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
                value={
                  assignedCriterias
                    ? assignedCriterias?.findIndex(
                        (item) => item.criteriaId === selectedCriteriaId
                      )
                    : 0
                }
                onChange={(e) => {
                  setSelectedCriteriaId(
                    assignedCriterias?.[e.target.value]?.criteriaId
                  );
                  setCriteriaStandards(
                    assignedCriterias?.[e.target.value]?.evaluatedStandards
                  );
                }}
                label="criteria"
              >
                {assignedCriterias.map((criteria, index) => (
                  <MenuItem key={index} value={index}>
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
                {criteriaStandards.length === 0 ? (
                  <TableRow
                    textalign="center"
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={3}>
                      <Typography
                        variant="h6"
                        align="center"
                        sx={{ mt: 5, mb: 5 }}
                      >
                        No Data Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  criteriaStandards.map((standard, index) => (
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
                  ))
                )}
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
      )}
    </>
  );
}

export default PEStandardwiseDetails;
