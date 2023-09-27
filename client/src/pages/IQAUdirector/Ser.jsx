import { Link } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
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
  Button
} from "@mui/material";

const IQAUSer = () => {

  useSetUserNavigations([
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "PG Programs",
      link: "/pgPrograms",
    },
    {
      name: "View SER",
      link: "/ser",
    },
  ]);

  const decodedPgprId = 1;

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

  function createData(criteria, submitted_standards, y1, y2, y3, y4, y5) {
    return { criteria, submitted_standards, y1, y2, y3, y4, y5 };
  }

  const rows = [
    createData(
      "Programme Management",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "P. Design and Development",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "Human Physical Res. & LS",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "Teaching Learning Research",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "Programme Evaluation",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "Student Assessment & Awards",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
    createData(
      "Innovative & Healthy Practices",
      "X1/27",
      "x11",
      "x12",
      "x12",
      "x12",
      "x12"
    ),
  ];

  const columns = [
    {
      column: "criteria",
      label: "Criteria",
      colspan: 1,
    },
    {
      column: "submitted_standards",
      label: "Submitted Standards",
      colspan: 1,
    },
    {
      column: "evidences",
      label: "Evidences",
      colspan: 5,
    },
  ];

  const actions = [
    {
      action: "Edit",
      background: "#2196F3",
      hover: "#1976D2",
      to: "/iqau_director/editSer",
      onclick: () => {
        console.log("Edit");
      },
    },
    {
      action: "Summary",
      background: "#4CAF50",
      hover: "#388E3C",
      onclick: () => {
        console.log("Summary");
      },
    },
  ];

  return (
    <>
      <Divider textAlign="left">
        <Chip label="Postgraduate Program" />
      </Divider>
      <Box
        sx={{
          height: "auto",
          backgroundColor: "#D8E6FC",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginY: "1rem",
        }}
      >
        <Grid container spacing={1} columns={{ sm: 6, md: 12 }}>
          {headerInfo.map((infoItem, index) => (
            <>
              <Grid item sm={2} md={2} key={index}>
                <Typography variant="body1" textAlign={"left"}>
                  <b>{infoItem.label}</b>
                </Typography>
              </Grid>
              <Grid item sm={4} md={4} key={index}>
                <Typography variant="body1" textAlign={"left"}>
                  {infoItem.value}
                </Typography>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
      <Divider textAlign="left">
        <Chip label="Self Evaluation Report" />
      </Divider>
      <TableContainer
        component={Paper}
        sx={{ height: "auto", margin: "1rem 0" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.column}
                  align="center"
                  sx={{
                    backgroundColor: "#D8E6FC",
                    paddingY: "0.25rem",
                    fontWeight: "bold",
                  }}
                  colSpan={column.colspan}
                >
                  <b>{column.label}</b>
                </TableCell>
              ))}
              {actions.length != 0 && (
                <TableCell
                  key="Actions"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#D8E6FC",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25" }}
                align="left"
              >
                <b></b>
              </TableCell>
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (number, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25rem" }}
                  >
                    <b>Y{number}</b>
                  </TableCell>
                )
              )}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25rem" }}
              >
                <b></b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                hover
                key={row.criteria}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ paddingY: "0.5rem" }}>
                  {row.criteria}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.submitted_standards}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.y1}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.y2}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.y3}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.y4}
                </TableCell>
                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                  {row.y5}
                </TableCell>
                {actions.length != 0 && (
                  <TableCell sx={{ display: "flex", justifyContent: "center", paddingY: "0.5rem" }}>
                    {actions.map((action) => (
                      <Button
                        component={Link}
                        to={action.to}
                        key={action.action}
                        onClick={action.onclick}
                        variant="contained"
                        size="small"
                        sx={{
                          background: action.background,
                          color: "#fff",
                          "&:hover": {
                            background: action.hover,
                          },
                          marginRight: "10px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          "&:lastChild": {
                            marginRight: "0",
                          },
                        }}
                      >
                        {action.action}
                      </Button>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "end",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="normal"
          sx={{ float: "right" }}
        >
          <Typography variant="body1">
            <b>Give Recommendation</b>
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default IQAUSer;
