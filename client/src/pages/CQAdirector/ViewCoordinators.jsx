import React, { useState } from "react";
import MainContent from "../../components/MainContent";
import ScrollableDiv from "../../components/ScrollableDiv";
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const CustomTable = ({ tableData, filterStatus }) => {
    const filteredData = filterStatus
      ? tableData.filter((row) => row.status === filterStatus)
      : tableData;
  
    return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center"><b>PGPR ID</b></TableCell>
                <TableCell align="center"><b>Coordinator</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>PGP</b></TableCell>
                <TableCell align="center"><b>Status (of PGP)</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.pgprID}</TableCell>
                  <TableCell align="center">{row.coordinator}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.pgp}</TableCell>
                  <TableCell align="center">{row.pgpStatus}</TableCell>
                  <TableCell align="center">
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"/view/" + row.pgprID}
                    >
                      View
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"/edit/" + row.pgprID}
                    >
                      Edit
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(row.pgprID)}
                    >
                      Delete
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(row.pgprID)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Box mt={2} display="flex" justifyContent="center">
        <Link to="/create_pgpr">
          <Button variant="contained" color="primary">
            Create PGPR Application
          </Button>
        </Link>
      </Box>
    </div>
  );
};

const ViewPGPrograms = () => {
    useSetUserNavigations([
      {
        name: "View PG Programs",
        link: "/ViewPGPrograms",
      },
    ]);
  
    const [searchedUniversity, setSearchedUniversity] = useState("");
    const [searchedFaculty, setSearchedFaculty] = useState("");
    const [filterStatus, setFilterStatus] = useState(""); // State for filter by PGPR status
  
    const handleSearch = (universityName, facultyName) => {
      setSearchedUniversity(universityName);
      setSearchedFaculty(facultyName);
    };
  

  // Hardcoded data for the table
  const tableData = [
    {
      pgprID: "UOC 12",
      coordinator: "Dr. Manju",
      status: "Recommended",
      pgp: "MCS",
      pgpStatus: "In Review",
    },
    {
      pgprID: "UOC 12",
      coordinator: "Dr. Pasindu",
      status: "Pending",
      pgp: "MCS",
      pgpStatus: "Accepted",
    },
    {
      pgprID: "UOC 12",
      coordinator: "Dr. Thilini",
      status: "Completed",
      pgp: "MCS",
      pgpStatus: "Completed",
    },
  ];
  // Available PGPR status options for the filter dropdown
  const pgprStatusOptions = [
    "In Review",
    "Accepted",
    "Completed",
  ];
  
  return (
    <ScrollableDiv height="600px">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
        <h2 className="text-2xl font-bold text-center">View Program Coordinators/Dean (IQAU Director) </h2>
        <hr className="border-t-2 border-black my-4 opacity-50" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="university" className="block font-medium text-gray-700">
              University Name:
            </label>
            <input
              type="text"
              id="university"
              className="form-input border border-black p-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="faculty" className="block font-medium text-gray-700">
              IQAU Director:
            </label>
            <input
              type="text"
              id="faculty"
              className="form-input border border-black p-1"
            />
          </div>
          <div className="flex justify-center items-end col-span-2"> {/* Updated styles here */}
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <div className="flex flex-col"> {/* Updated styles here */}
            <label htmlFor="status" className="block font-medium text-gray-700">
              Filter by PGPR Status:
            </label>
            <select
              id="status"
              className="form-select border border-black p-1"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              {pgprStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <CustomTable tableData={tableData} filterStatus={filterStatus} />
    </ScrollableDiv>
  );
};

export default ViewPGPrograms;





