import React, { useState, useEffect } from "react";
import MainContent from "../../components/MainContent";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import { CircularProgress } from "@mui/material";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  NavigateBefore,
  NavigateNext,
  SkipNext,
  SkipPrevious,
  Search,
} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import getCQADirectorUniversity from "../../api/CQADirector/getCQADirectorUniversity";
import getUniversityFaculties from "../../api/University/getUniversityFaculties";
import getCurrentDean from "../../api/Faculty/getCurrentDean";
import getFacultyPostGraduatePrograms from "../../api/Faculty/getFacultyPostGraduatePrograms";
import getCurrentCoordinator from "../../api/PostGraduateProgram/getCurrentCoordinator";



const CustomTable = ({ tableData, openEditDialog }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center">
                  <b>Profile Photo</b>
                </TableCell>
                <TableCell align="center">
                  <b>C-ID</b>
                </TableCell>
                <TableCell align="center">
                  <b>Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Faculty</b>
                </TableCell>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
                <TableCell align="center">
                  <b>No. of PG Programs</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
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
                      onClick={() => openEditDialog(row)}
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  const [university, setUniversity] = useState(null); // Add this state to store university data
  const [universityFaculties, setUniversityFaculties] = useState([]); // State to store faculties
  const [tableData, setTableData] = useState([]); // Initialize tableData as an empty array


  
  useEffect(() => {
    async function fetchData() {
      try {
        
        const cqaDirectorId = auth.id; 
        const response = await getCQADirectorUniversity(cqaDirectorId);
        const universityData = response.data;
        setUniversity(universityData);

        // Fetch faculties of the university
        const universityId = universityData.id;
        const facultiesResponse = await getUniversityFaculties(universityId);
        const facultiesData = facultiesResponse.data;

        // Fetch the current dean for a specific faculty
        const facultyId = "FACULTY_ID";
        const deanResponse = await getCurrentDean(facultyId);
        const deanData = deanResponse.data;

        // Fetch postgraduate programs for the same faculty
        const postGradProgramsResponse = await getFacultyPostGraduatePrograms(facultyId);
        const postGradProgramsData = postGradProgramsResponse.data;

        // Fetch coordinators for each postgraduate program
        const coordinatorPromises = postGradProgramsData.map(async (program) => {
          const coordinatorResponse = await getCurrentCoordinator(program.id);
          return coordinatorResponse.data;
        });

        const coordinatorsData = await Promise.all(coordinatorPromises);

        // Combine deanData, postGradProgramsData, and coordinatorsData into tableData
        const updatedTableData = [deanData, ...postGradProgramsData, ...coordinatorsData];

        setTableData(updatedTableData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);
  const [selectedCoordinatorForEdit, setSelectedCoordinatorForEdit] = useState(
    {}
  );

  // Define openEditPopup function within the Coordinators component
  const handleOpenEditDialog = (coordinator) => {
    setSelectedCoordinatorForEdit(coordinator);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCoordinatorForEdit) {
      // Update the tableData with the edited coordinator details
      const updatedTableData = tableData.map((coordinator) =>
        coordinator.cid === selectedCoordinatorForEdit.cid
          ? selectedCoordinatorForEdit
          : coordinator
      );

      setTableData(updatedTableData);
      handleCloseEditDialog();
    }
  };

  const handleCloseEditDialog = () => {
    setSelectedCoordinatorForEdit(null);
    setIsEditDialogOpen(false);
  };

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
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
      <h2 className="text-2xl font-bold text-center">
        View Program Coordinators/Dean (IQAU Director){" "}
      </h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <div className="grid grid-cols-2 gap-4"></div>

      <div className="flex justify-center mt-4">
        <Button variant="contained" color="primary">
          Show Current Coordinators
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "8px" }}
        >
          Show Current Dean/Director
        </Button>
      </div>
      {/* Conditionally render the loading indicator */}
    {isLoading ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Horizontally center
          alignItems: "center", // Vertically center
          height: "60vh", // Adjust the height as needed
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Loading</p>
          <CircularProgress style={{ marginLeft: "8px" }} />
        </div>
      </div>
    ) : (
        // Render the table when not loading
        <CustomTable
          tableData={tableData}
          openEditDialog={handleOpenEditDialog}
        />
      )}

      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md" // Adjust the width as needed
        fullWidth // Take up the full width
      >
        <DialogTitle style={{ fontSize: "24px", fontWeight: "bold" }}>
          Edit Coordinator Details
        </DialogTitle>
        <DialogContent className="w-full">
          <form className="dialog-form space-y-4">
            <div className="flex flex-col">
              <label
                htmlFor="cid"
                className="text-sm font-medium text-gray-700"
              >
                C-ID:
              </label>
              <input
                type="text"
                id="cid"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.cid}
                // Add an onChange handler to update selectedCoordinatorForEdit.cid
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    cid: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.name}
                // Add an onChange handler to update selectedCoordinatorForEdit.name
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="faculty"
                className="text-sm font-medium text-gray-700"
              >
                Faculty:
              </label>
              <input
                type="text"
                id="faculty"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.faculty}
                // Add an onChange handler to update selectedCoordinatorForEdit.faculty
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    faculty: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
              >
                Status:
              </label>
              <input
                type="text"
                id="status"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.status}
                // Add an onChange handler to update selectedCoordinatorForEdit.pgCount
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    status: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="pgCount"
                className="text-sm font-medium text-gray-700"
              >
                No. of PG Programs:
              </label>
              <input
                type="number"
                id="pgCount"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.pgCount}
                // Add an onChange handler to update selectedCoordinatorForEdit.pgCount
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    pgCount: e.target.value,
                  }))
                }
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions className="mt-4 space-x-2">
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <div className="flex justify-end mt-4">
        {" "}
        {/* Align buttons to the right */}
        <NavigateBefore color="primary" fontSize="large" />
        <SkipPrevious color="primary" fontSize="large" />
        <SkipNext color="primary" fontSize="large" />
        <NavigateNext color="primary" fontSize="large" />
      </div>
      <div className="flex justify-start mt-4">
        {" "}
        {/* Align buttons to the left */}
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "8px" }}
        >
          Select Coordinator/Dean for PGPR
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "8px" }}
        >
          New Coordinator/Dean
        </Button>
      </div>
    </div>
  );
};

export default Coordinators;
