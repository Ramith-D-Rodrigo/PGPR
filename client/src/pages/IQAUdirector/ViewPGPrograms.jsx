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
  Grid,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import useAuth from "../../hooks/useAuth";
import getAllPostGraduatePrograms from "../../api/PostGraduateProgram/getAllPostGraduatePrograms";
import getIQAUDirectorFaculty from "../../api/IQAUDirector/getIQAUDirectorFaculty";
import getAUniversity from "../../api/University/getAUniversity";
import getProgrammeCoordinator from "../../api/ProgrammeCoordinator/getProgrammeCoordinator";

const ViewPGPs = () => {
  const { auth } = useAuth();
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
  const [allPrograms, setAllPrograms] = useState([]);
  const [faculty, setFaculty] = useState({});
  const [university, setUniversity] = useState({});
  const [pgps, setPgps] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modifiedData, setModifiedData] = useState([]);
  const [coordinator, setCoordinator] = useState({});
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const fetchPgPrograms = async () => {
      try {
        setLoading(1);
        const allPgPrograms = await getAllPostGraduatePrograms({
          includeFaculty: true,
        });
        setAllPrograms(allPgPrograms.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(0);
      }
    };

    const fetchFaculty = async () => {
      try {
        setLoading(2);
        const facultyData = await getIQAUDirectorFaculty(auth.id);
        setFaculty(facultyData.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(0);
      }
    };

    fetchPgPrograms();
    fetchFaculty();
  }, [auth.id]);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(3);
        const universityData = await getAUniversity(faculty.universityId);
        setUniversity(universityData.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(0);
      }
    };
    if (faculty && faculty.universityId !== undefined) {
      fetchUniversity();
    }
  }, [faculty]);

  useEffect(() => {
    if (allPrograms.length !== 0 && faculty.length !== 0) {
      const facultyPrograms = allPrograms.filter((program) => {
        return program.facultyId === faculty.id;
      });
      setPgps(facultyPrograms);
    }
  }, [allPrograms, faculty]);

  useEffect(() => {
    if (pgps.length !== 0) {
      try {
        setLoading(4);
        const coordinatorPromises = pgps.map(async (pgp) => {
          const coordinatorData = await getProgrammeCoordinator(
            pgp.programmeCoordinatorId
          );
          setCoordinator(coordinatorData);
        });

        const modified = async () => {
          const data = await Promise.all(coordinatorPromises);
          setModifiedData(data);
        };

        modified();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(0);
      }
    }
  }, [pgps]);

  console.log("All: ", allPrograms);
  console.log("Faculty: ", faculty);
  console.log("Pgp: ", pgps);
  console.log("Uni: ", university);

  const columns = {
    title: "Title",
    slqfLevel: "SLQF Level",
    commencementYear: "Commencement Year",
    programCoordinator: "Programme Coordinator",
  };

  const filterPGPs = () => {
    const filteredData = modifiedData.filter((pgp) => {
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
    return filteredData;
  };

  console.log("Modified: ", modifiedData);
  console.log("Filtered: ", filterPGPs());

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
      value: university.name ? university.name.toString() : "",
    },
    {
      title: "Faculty/Institute: ",
      value: faculty.name ? faculty.name.toString() : "",
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
            <React.Fragment key={`uni-faculty-${index}`}>
              <Grid item sm={2} md={2} key={`${index}-1`}>
                <Typography variant="body1" textAlign={"left"}>
                  <b>{item.title}</b>
                </Typography>
              </Grid>
              <Grid item sm={4} md={4} key={`${index}-2`}>
                <Typography variant="body1" textAlign={"left"}>
                  {item.value}
                </Typography>
              </Grid>
            </React.Fragment>
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
              .map((row, rowIndex) => (
                <TableRow
                  hover
                  key={`row-${rowIndex}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {Object.values(row).map((col, colIndex) => (
                    <TableCell
                      sx={{ paddingY: "0.5rem" }}
                      key={`col-${colIndex}`}
                    >
                      {col}
                    </TableCell>
                  ))}
                  {actions.length !== 0 && (
                    <TableCell
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        paddingY: "0.5rem",
                      }}
                      key={`actions-${rowIndex}`} // Use a unique key here as well
                    >
                      {actions.map((action, actionIndex) => (
                        <Button
                          component={Link}
                          to={action.to}
                          key={`action-button-${actionIndex}`} // Ensure each action has a unique key
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
                          disabled={
                            actionIndex === 1 && row.status !== "In-review"
                          }
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
        count={filterPGPs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ViewPGPs;
