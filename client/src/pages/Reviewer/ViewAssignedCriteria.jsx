import { useEffect, useRef } from "react";

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
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import DiscriptiveDiv from "../../components/DiscriptiveDiv";

const ViewAssignedCriteria = () => {
  const buttonGridRef = useRef(null);
  const { pgprId } = useParams();
  const decodedPgprId = decodeURIComponent(pgprId);
  console.log(pgprId);
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${decodedPgprId}`,
    },
  ]);

  const headerInfo = [
    { label: "University:", value: "University of Colombo" },
    {
      label: "Faculty/Institute:",
      value: "University of Colombo School of Computing",
    },
    { label: "PGPR ID:", value: decodedPgprId },
    { label: "PGPR Name:", value: "MSc" },
    { label: "Application Start Date:", value: "12/12/2020" },
    { label: "Submission Date:", value: "01/01/2021" },
    { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
  ];

  function createData(
    criteria,
    submitted_standards,
    y1,
    y2,
    y3,
    y4,
    y5,
    Actions
  ) {
    Actions = Actions.map((action, index) => {
      let allow = action.allow ? { disabled: false } : { disabled: true };
      if (action.action === "Evaluate") {
        return (
          <Link key={index} to={action.allow ? criteria : ""}>
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
      }
    });
    return { criteria, submitted_standards, y1, y2, y3, y4, y5, Actions };
  }

  const rows = [
    createData(
      "Human Physical Res. & LS",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12",
      [{ action: "Evaluate", allow: true }]
    ),
    createData(
      "Teaching Learning Research",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12",
      [{ action: "Evaluate", allow: true }]
    ),
    createData(
      "Programme Evaluation",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12",
      [{ action: "Evaluate", allow: true }]
    ),
  ];

  const finalButtons = [
    {
      title: "View Standards Wise Details of Proper Review",
      to: `../Standardwise_details/${decodedPgprId}`,
    },
    {
      title: "View Summary Details of Criteria",
      to: `../Summary_details/${decodedPgprId}`,
    },
  ];

  useEffect(() => {
    const setMaxButtonHeight = () => {
      if (buttonGridRef.current) {
        const buttons = buttonGridRef.current.querySelectorAll("Button");
        let maxHeight = 0;
        buttons.forEach((button) => {
          const buttonHeight = button.clientHeight;
          if (buttonHeight > maxHeight) {
            maxHeight = buttonHeight;
          }
        });

        buttons.forEach((button) => {
          button.style.height = `${maxHeight}px`;
        });
      }
    };

    setMaxButtonHeight();
    window.addEventListener("resize", setMaxButtonHeight);

    return () => {
      window.removeEventListener("resize", setMaxButtonHeight);
    };
  }, []);

  return (
    <>
      <DiscriptiveDiv
        description="PG Program"
        width="100%"
        height="auto"
        backgroundColor="#D8E6FC"
      >
        <Grid container spacing={2}>
          {headerInfo.map((infoItem, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle1">
                <b>{infoItem.label}</b>
              </Typography>
              <Typography>{infoItem.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </DiscriptiveDiv>

      <DiscriptiveDiv
        description="Proper Evaluation"
        width="100%"
        height="auto"
        backgroundColor="#D9D9D9"
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
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
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
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
              {rows.map((row) => (
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
                  <TableCell align="center">{row.Actions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DiscriptiveDiv>

      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        sx={{ padding: { xs: "10px 0", sm: "20px 0" } }}
      >
        {finalButtons.map((buttonItem, index) => (
          <Grid ref={buttonGridRef} item xs={12} sm={4} key={index}>
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
              component={Link}
              to={buttonItem.to}
            >
              {buttonItem.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ViewAssignedCriteria;
