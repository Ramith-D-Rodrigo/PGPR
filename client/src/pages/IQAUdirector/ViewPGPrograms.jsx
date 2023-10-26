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
import _ from "lodash";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import useAuth from "../../hooks/useAuth";
import getAllPostGraduatePrograms from "../../api/PostGraduateProgram/getAllPostGraduatePrograms";
import getIQAUDirectorFaculty from "../../api/IQAUDirector/getIQAUDirectorFaculty";
import getAUniversity from "../../api/University/getAUniversity";

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

  const [allPrograms, setAllPrograms] = useState([]);
  const [faculty, setFaculty] = useState({});
  const [university, setUniversity] = useState({});
  const [pgps, setPgps] = useState([]);
  const [selectedFilterKeys, setSelectedFilterKeys] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const facultyData = await getIQAUDirectorFaculty(auth.id);
        setFaculty(facultyData.data.data);

        if (faculty.id) {
          const universityData = await getAUniversity(
            faculty.universityId
          );
          setUniversity(universityData.data.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [auth.id, faculty.id, faculty.universityId]);

  useEffect(() => {
    const fetchPgPrograms = async () => {
      try {
        setLoading(true);
        const allPgPrograms = await getAllPostGraduatePrograms({
          includeFaculty: true,
          includeCurrentCoordinator: true,
          includeAcademicStaff: true,
          includeUniversitySide: true,
          includeUser: true,
        });
        setAllPrograms(allPgPrograms.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPgPrograms();
  }, [auth.id]);

  useEffect(() => {
    if (allPrograms.length !== 0 && faculty.id) {
      const facultyPrograms = allPrograms.filter((program) => {
        return program.facultyId === faculty.id;
      });
      setPgps(facultyPrograms);
    }
  }, [allPrograms, faculty]);

  const columns = {
    title: "Title",
    slqfLevel: "SLQF Level",
    commencementYear: "Commencement Year",
    programmeCoordinator: "Programme Coordinator",
  };

  const filterPGPs = () => {
    const filteredData = pgps.map((pgp) => ({
      title: pgp.title,
      slqfLevel: pgp.slqfLevel,
      commencementYear: pgp.commencementYear,
      programmeCoordinator: pgp.programmeCoordinator,   
    })).filter((filteredPgp) => {
      const matchesKeyword = Object.values(filteredPgp).some((value) =>
        value
          ? value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
          : false
      );

      // const matchesFilters =
      //   selectedFilterKeys.length === 0 ||
      //   selectedFilterKeys.some(
      //     (filter) => filter && filter.title === filteredPgp.status
      //   );

      // return matchesKeyword && matchesFilters;
      return matchesKeyword;
    });
    return filteredData;
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
  ];

  // const status = [
  //   { title: "In-review" },
  //   { title: "Accepted" },
  //   { title: "Rejected" },
  //   { title: "Pending" },
  // ];

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

  // const customEqualityTest = (option, value) => {
  //   return option.title === value.title;
  // };

  const handleSearchInputChange = _.debounce((value) => {
    setSearchKeyword(value);
  }, 300);

  const columnMappings = {
    title: (value) => (
      <TableCell sx={{ paddingY: "0.5rem" }} key="title">
        {value}
      </TableCell>
    ),
    slqfLevel: (value) => (
      <TableCell sx={{ paddingY: "0.5rem" }} key="slqfLevel">
        {value}
      </TableCell>
    ),
    commencementYear: (value) => (
      <TableCell sx={{ paddingY: "0.5rem" }} key="commencementYear">
        {value}
      </TableCell>
    ),
    programmeCoordinator: (value) => (
      <TableCell sx={{ paddingY: "0.5rem" }} key="programmeCoordinator">
        {String(value.academicStaff.universitySide.user.initials)}.{String(value.academicStaff.universitySide.user.surname)}
      </TableCell>
    ),
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
        {/* <Autocomplete
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
        /> */}
        <TextField
          id="outlined-basic"
          variant="outlined"
          sx={{ marginBottom: "20px" }}
          label="Search"
          size="small"
          value={searchKeyword}
          onChange={(e) => handleSearchInputChange(e.target.value)}
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
              {actions.length !== 0 && (
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
            {filterPGPs().length !== 0 &&
              filterPGPs()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    hover
                    key={`row-${rowIndex}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {Object.keys(row).map((key) =>(
                      columnMappings[key](row[key])
                    )
                    )}
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
                            onClick={() => action.onclick()}
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
