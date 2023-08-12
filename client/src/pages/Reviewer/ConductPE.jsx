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

const ConductPE = () => {
  const { pgprId } = useParams();
  const decodedPgprId = decodeURIComponent(pgprId);
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
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

  const rows = [
    {
      name: "John Doe",
      designation: "Professor",
      status: "Reviewer",
      listOfCriteria: [
        "Programme Evaluation",
        "Student Assessment & Awards",
        "Innovative & Healthy Practices",
      ],
    },
    {
      name: "Jane Smith",
      designation: "Associate Professor",
      status: "Reviewer",
      listOfCriteria: ["Programme Management", "P. Design and Development"],
    },
    {
      name: "Michael Johnson",
      designation: "Assistant Professor",
      status: "Chair",
      listOfCriteria: [
        "Human Physical Res. & LS",
        "Teaching Learning Research",
      ],
    },
  ];

  const finalButtons = [
    {
      title: "View Assigned Criteria",
      to: `./Assigned_criteria/${decodedPgprId}`,
    },
  ];

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
                  <b>Name</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Designation</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Status</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>List of Criterian</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.designation}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">
                    <ul
                      style={{
                        listStyleType: "disc",
                        textAlign: "left",
                        paddingLeft: "20%",
                      }}
                    >
                      {row.listOfCriteria.map((criteriaItem, index) => (
                        <li key={index}>
                          <Typography>{criteriaItem}</Typography>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
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
          <Grid item xs={12} sm={4} key={index}>
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

export default ConductPE;
