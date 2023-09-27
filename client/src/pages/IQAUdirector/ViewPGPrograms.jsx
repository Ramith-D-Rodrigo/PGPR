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
  Typography,
  Box,
  Autocomplete,
  TextField,
  Divider,
  Chip,
  Grid
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
//import axios from "../../api/api.js";

const ViewPGPs = () => {
  useSetUserNavigations([
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "PG Programs",
      link: "/pgPrograms",
    },
  ]);

  const [selectedFilterKeys, setSelectedFilterKeys] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
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
      status: "In-review",
    },
    {
      title: "Electrical Engineering",
      slqf_level: "7",
      commencement_year: "2018",
      program_coordinator: "Emily Johnson",
      status: "Accepted",
    },
    {
      title: "Business Administration",
      slqf_level: "6",
      commencement_year: "2019",
      program_coordinator: "Michael Brown",
      status: "Rejected",
    },
    {
      title: "Mechanical Engineering",
      slqf_level: "7",
      commencement_year: "2021",
      program_coordinator: "Sophia Davis",
      status: "Pending",
    },
    {
      title: "Biology",
      slqf_level: "5",
      commencement_year: "2017",
      program_coordinator: "David Lee",
      status: "In-review",
    },
    {
      title: "Psychology",
      slqf_level: "6",
      commencement_year: "2022",
      program_coordinator: "Olivia Martinez",
      status: "Accepted",
    },
    {
      title: "Environmental Science",
      slqf_level: "5",
      commencement_year: "2016",
      program_coordinator: "Emma Wilson",
      status: "Rejected",
    },
    {
      title: "Marketing",
      slqf_level: "6",
      commencement_year: "2020",
      program_coordinator: "Daniel Johnson",
      status: "Pending",
    },
    {
      title: "Civil Engineering",
      slqf_level: "7",
      commencement_year: "2019",
      program_coordinator: "Sophie Miller",
      status: "In-review",
    },
    {
      title: "Chemistry",
      slqf_level: "5",
      commencement_year: "2017",
      program_coordinator: "Alexander Green",
      status: "Accepted",
    },
  ];

  const columns = {
    title: "Title",
    slqf_level: "SLQF Level",
    commencement_year: "Commencement Year",
    program_coordinator: "Programme Coordinator",
    status: "Status",
  };

  const actions = [
    {
      action: "View",
      background: "#2196F3",
      hover: "#1976D2",
      to: "/iqau_director/pgProgramDetails",
      onclick: () => {
        console.log("View");
      },
    },
    {
      action: "SER",
      background: "#4CAF50",
      hover: "#388E3C",
      to: "/iqau_director/ser",
      onclick: () => {
        console.log("SER");
      },
    },
  ];

  const status = [
    { title: "In-review" },
    { title: "Accepted" },
    { title: "Rejected" },
    { title: "Pending" },
  ];

  const uniAndFaculty = [
    { 
      title: "University: ",
      value: "University of Colombo"
    },
    {
      title: "Faculty/Institute: ",
      value: "Faculty of Science"
    }
  ];

  const filterPGPs = () => {
    const filteredStatus = pgps.filter((pgp) => {
      const matchesKeyword = Object.values(pgp).some((value) =>
        value
          ? value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
          : false
      );

      const matchesFilters =
        selectedFilterKeys.length === 0 ||
        selectedFilterKeys.some((filter) => filter.title === pgp.status);

      return matchesKeyword && matchesFilters;
    });

    return filteredStatus;
  };

  const customEqualityTest = (option, value) => {
    return option.title === value.title;
  };

  return (
    <>
      <Divider textAlign="left">
        <Chip label="Browse Postgraduate Programs" />
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
          {uniAndFaculty.map((item, index) => (
            <>
              <Grid item sm={2} md={2} key={index}>
                <Typography variant="body1" textAlign={"left"}>
                  <b>{item.title}</b>
                </Typography>
              </Grid>
              <Grid item sm={4} md={4} key={index}>
                <Typography variant="body1" textAlign={"left"}>
                  {item.value}
                </Typography>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <Autocomplete
          sx={{ marginBottom: "20px", minWidth: "200px" }}
          multiple
          id="tags-outlined"
          options={status}
          getOptionLabel={(option) => option.title}
          value={selectedFilterKeys}
          onChange={(event, newValue) => {
            setSelectedFilterKeys(newValue);
          }}
          isOptionEqualToValue={customEqualityTest}
          renderInput={(params) => (
            <TextField {...params} label="Filter by Status" size="small" />
          )}
        />
        <TextField
          id="outlined-basic"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          height: "auto",
          margin: "1rem 0",
        }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {Object.values(columns).map((column) => (
                <TableCell
                  key={column}
                  sx={{ fontWeight: "bold", backgroundColor: "#D8E6FC" }}
                >
                  {column}
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
          </TableHead>
          <TableBody>
            {filterPGPs()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  hover
                  key={row.title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.values(row).map((col) => (
                    <TableCell sx={{ paddingY: "0.5rem" }} key={col}>{col}</TableCell>
                  ))}
                  {actions.length != 0 && (
                    <TableCell
                      sx={{ display: "flex", justifyContent: "center", paddingY: "0.5rem" }}
                    >
                      {actions.map((action, index) => (
                        <Button
                          component={Link}
                          to={action.to}
                          key={action.action+index}
                          onClick={action.onclick}
                          variant="contained"
                          size="small"
                          sx={{
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
                          disabled={index===1 && row.status !== "In-review"}
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
        count={filterPGPs().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ViewPGPs;
