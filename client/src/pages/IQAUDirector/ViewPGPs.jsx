import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TablePagination,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
//import axios from "../../api/api.js";

const ViewPGPs = () => {
  //let [pgps, setPgps] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // useEffect(() => {
  //   axios
  //     .get("/api/v1/postGraduatePrograms")
  //     .then((response) => {
  //       setPgps(response.data.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const pgps = [
    {
      title: "Computer Science",
      slqf_level: "6",
      commencement_year: "2020",
      program_coordinator: "John Smith",
    },
    {
      title: "Electrical Engineering",
      slqf_level: "7",
      commencement_year: "2018",
      program_coordinator: "Emily Johnson",
    },
    {
      title: "Business Administration",
      slqf_level: "6",
      commencement_year: "2019",
      program_coordinator: "Michael Brown",
    },
    {
      title: "Mechanical Engineering",
      slqf_level: "7",
      commencement_year: "2021",
      program_coordinator: "Sophia Davis",
    },
    {
      title: "Biology",
      slqf_level: "5",
      commencement_year: "2017",
      program_coordinator: "David Lee",
    },
    {
      title: "Psychology",
      slqf_level: "6",
      commencement_year: "2022",
      program_coordinator: "Olivia Martinez",
    },
    {
      title: "Environmental Science",
      slqf_level: "5",
      commencement_year: "2016",
      program_coordinator: "Emma Wilson",
    },
    {
      title: "Marketing",
      slqf_level: "6",
      commencement_year: "2020",
      program_coordinator: "Daniel Johnson",
    },
    {
      title: "Civil Engineering",
      slqf_level: "7",
      commencement_year: "2019",
      program_coordinator: "Sophie Miller",
    },
    {
      title: "Chemistry",
      slqf_level: "5",
      commencement_year: "2017",
      program_coordinator: "Alexander Green",
    },
  ];

  const columns = {
    title: "Title",
    slqf_level: "SLQF Level",
    commencement_year: "Commencement Year",
    program_coordinator: "Programme Coordinator",
  };

  const actions = [
    {
      action: "View",
      background: "#2196F3",
      hover: "#1976D2",
      to: "/iqau_director/pgPrograms/",
      onclick: () => {
        console.log("View");
      },
    },
    {
      action: "edit",
      background: "#4CAF50",
      hover: "#388E3C",
      onclick: () => {
        console.log("Edit");
      },
    },
    {
      action: "delete",
      background: "#F44336",
      hover: "#D32F2F",
      onclick: () => {
        console.log("Delete");
      },
    },
  ];

  return (
    <>
      <h1>Postgraduate Programs</h1>
      <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: "none" }}>
        <TableContainer
          sx={{
            maxWidth: "100%",
            overflow: "scroll",
            margin: "0 auto",
            marginTop: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            maxHeight: "800px",
            border: "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {Object.values(columns).map((column) => (
                  <TableCell
                    key={column}
                    sx={{ fontWeight: "bold", backgroundColor: "#64b5f6" }}
                  >
                    {column}
                  </TableCell>
                ))}
                {actions.length != 0 && (
                  <TableCell
                    key="Actions"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#64b5f6",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {pgps
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" key={row.title}>
                    {Object.values(row).map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                    {actions.length != 0 && (
                      <TableCell sx={{ display: "flex", textAlign: "center" }}>
                        {actions.map((action) => (
                          <Button
                            component={Link}
                            to={action.to + `${encodeURI(row)}`}
                            key={action.action}
                            onClick={action.onclick}
                            variant="contained"
                            color="primary"
                            style={{
                              background: action.background,
                              color: "#fff",
                              "&:hover": {
                                background: action.hover,
                              },
                              padding: "5px 10px",
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={pgps.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default ViewPGPs;
