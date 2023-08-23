import React, { useState } from "react";
import MainContent from "../../components/MainContent";
import ScrollableDiv from "../../components/ScrollableDiv";
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@mui/material';
import { Link } from "react-router-dom";
import { NavigateBefore, NavigateNext, SkipNext, SkipPrevious, Search } from '@mui/icons-material';

const CustomTable = ({ tableData }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>q

          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center"><b>Profile Photo</b></TableCell>
                <TableCell align="center"><b>C-ID</b></TableCell>
                <TableCell align="center"><b>Name</b></TableCell>
                <TableCell align="center"><b>Faculty</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>No. of PG Programs</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    <Avatar alt="Profile Photo" src={row.profilePhoto} />
                  </TableCell>
                  <TableCell align="center">{row.cid}</TableCell>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.faculty}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.pgCount}</TableCell>
                  <TableCell align="center">
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"CoordinatorProfile/" + row.cid}
                    >
                      View
                    </Button>

                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"/edit/" + row.cid}
                    >
                      Edit
                    </Button>
                    {/* Removed the onClick event for Delete button */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

const Coordinators = () => {
  useSetUserNavigations([
    {
      name: "View Program Coordinators",
      link: "/ViewCoordinators",
    },
  ]);

  const [searchedUniversity, setSearchedUniversity] = useState("");
  const [searchedDirector, setSearchedDirector] = useState("");

  const handleSearch = (universityName, directorName) => {
    setSearchedUniversity(universityName);
    setSearchedDirector(directorName);
  };

  // Hardcoded data for the table
  const tableData = [
    {
      cid: "C-100",
      name: "Dr. Manju",
      faculty: "Science",
      status: "Approved",
      pgCount: 3,
      profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg", // Professional profile photo of a gentleman
    },
    {
      cid: "C-101",
      name: "Dr. Pasindu",
      faculty: "Arts",
      status: "Confirmed",
      pgCount: 2,
      profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg", // Professional profile photo of a gentleman
    },
    {
      cid: "C-102",
      name: "Dr. Thilini",
      faculty: "Management",
      status: "Canceled",
      pgCount: 5,
      profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg", // Professional profile photo of a lady
    },
  ];

  const handleNavigateBefore = () => {
    // Handle the navigate before action here
    console.log("Navigating before");
  };

  const handleNavigateNext = () => {
    // Handle the navigate next action here
    console.log("Navigating next");
  };

  const handleSkipPrevious = () => {
    // Handle the skip previous action here
    console.log("Skipping previous");
  };

  const handleSkipNext = () => {
    // Handle the skip next action here
    console.log("Skipping next");
  };

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
            <label htmlFor="director" className="block font-medium text-gray-700">
              IQAU Director:
            </label>
            <input
              type="text"
              id="director"
              className="form-input border border-black p-1"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="contained" color="primary" onClick={() => handleSearch()}>
            <Search />
            Search
          </Button>
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="contained" color="primary">
            Show Current Coordinators
          </Button>
          <Button variant="contained" color="primary" style={{ marginLeft: "8px" }}>
            Show Current Dean/Director
          </Button>
        </div>

        <CustomTable tableData={tableData} />

        <div className="flex justify-end mt-4"> {/* Align buttons to the right */}
          <NavigateBefore color="primary" fontSize="large" />
          <SkipPrevious color="primary" fontSize="large" />
          <SkipNext color="primary" fontSize="large" />
          <NavigateNext color="primary" fontSize="large" />
        </div>
        <div className="flex justify-start mt-4"> {/* Align buttons to the left */}
          <Button variant="contained" color="primary" style={{ marginRight: "8px" }}>
            Select Coordinator/Dean for PGPR
          </Button>
          <Button variant="contained" color="primary" style={{ marginRight: "8px" }}>
            New Coordinator/Dean
          </Button>
        </div>
      </div>
    </ScrollableDiv>
  );
};

export default Coordinators;
