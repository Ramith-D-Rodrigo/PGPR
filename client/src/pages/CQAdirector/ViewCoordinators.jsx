import React, { useState, useEffect } from "react";
import MainContent from "../../components/MainContent";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import useAuth from "../../hooks/useAuth";
import { CircularProgress, Divider, Snackbar } from "@mui/material";
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
import { Chip } from "@mui/material";
import getCurrentIQAUDirector from "../../api/Faculty/getCurrentIQAUDirector";
import { SERVER_URL } from "../../assets/constants";
import removeIQAUDirectorRole from "../../api/IQAUDirector/removeIQAUDirectorRole";
import removeDeanRole from "../../api/Dean/removeDeanRole";
import removeProgrammeCoordinatorRole from "../../api/ProgrammeCoordinator/removeProgrammeCoordinatorRole";

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
                  <b>ID</b>
                </TableCell>
                <TableCell align="center">
                  <b>Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Role</b>
                </TableCell>
                <TableCell align="center">
                  <b>Faculty</b>
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
                    <Avatar alt="Profile Photo" src={
                      row.role === 'IQAU Director' ?
                        SERVER_URL.slice(0, -1) + row.qualityAssuranceStaff.universitySide.user.profilePic :
                        SERVER_URL.slice(0, -1) + row.academicStaff.universitySide.user.profilePic

                    } />
                  </TableCell>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">
                    {row.role === 'IQAU Director' ? row.qualityAssuranceStaff.universitySide.user.initials + " " + row.qualityAssuranceStaff.universitySide.user.surname : row.academicStaff.universitySide.user.initials + " " + row.academicStaff.universitySide.user.surname}
                  </TableCell>
                  <TableCell align="center">{row.role}</TableCell>
                  <TableCell align="center">{row.faculty.name}</TableCell>
                  <TableCell align="center">
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"CoordinatorProfile/" + row.id}
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
                      Unassign
                    </Button>


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
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const { auth } = useAuth();
  const [university, setUniversity] = useState(null); // Add this state to store university data
  const [universityFaculties, setUniversityFaculties] = useState([]); // State to store faculties
  const [tableData, setTableData] = useState([]); // Initialize tableData as an empty array

  useEffect(() => {
    async function fetchData() {
      try {
        const cqaDirectorId = auth.id;
        const response = await getCQADirectorUniversity(cqaDirectorId);
        const universityData = response.data.data;
        setUniversity(universityData);

        // Fetch faculties of the university
        const universityId = universityData.id;
        const facultiesResponse = await getUniversityFaculties(universityId);
        const facultiesData = facultiesResponse.data.data;
        console.log("Faculties Data:", facultiesData);

        const queryParams = {
          includeAcademicStaff: true,
          includeUniversitySide: true,
          includeUser: true,
        };

        // Initialize an array to store data for all coordinators
        let allCoordinatorData = [];

        for (let i = 0; i < facultiesData.length; i++) {
          const faculty = facultiesData[i];

          // Fetch the current dean for the current faculty
          let deanResponse = null;
          let deanData = null;
          try{
            deanResponse = await getCurrentDean(faculty.id, queryParams);
            deanData = deanResponse.data.data;
            deanData.faculty = faculty;
            deanData.role = "Dean";
          }
          catch(error){
            if(error.response.status == 404){
              //no dean for the current faculty
              //ignore the error
            }
          }

          // fetch iqau director for the current faculty
          let iqauDirectorResponse = null;
          let iqauDirectorData = null;
          try {
            iqauDirectorResponse = await getCurrentIQAUDirector(faculty.id, { includeQualityAssuranceStaff: true, includeUniversitySide: true, includeUser: true });
            iqauDirectorData = iqauDirectorResponse.data.data;
            iqauDirectorData.faculty = faculty;
            iqauDirectorData.role = "IQAU Director";

          } catch (error) {
            if(error.response.status == 404){
              //no iqau director for the current faculty
              //ignore the error 
            }
          }

          // Fetch postgraduate programs for the current faculty
          const postGradProgramsResponse = await getFacultyPostGraduatePrograms(
            faculty.id
          );
          const postGradProgramsData = postGradProgramsResponse.data.data;
          console.log("PG Data:", postGradProgramsData);

          // Fetch coordinators for each postgraduate program
          const coordinatorPromises = postGradProgramsData.map(
            async (program) => {
              try {
                console.log("log:", program.id);
                const coordinatorResponse = await getCurrentCoordinator(
                  program.id,
                  queryParams
                );
                console.log("response:", coordinatorResponse);

                const coordinatorData = coordinatorResponse.data.data;
                coordinatorData.faculty = faculty;
                coordinatorData.role = "Programme Coordinator";
                return coordinatorResponse.data.data;
              } catch (error) {
                  if(error.response.status == 404){
                    //there is no coordinator for the current postgraduate program
                    return;
                  }
              }
            }
          );

          let coordinatorsData = await Promise.all(coordinatorPromises);
          console.log("Coordinators Data:", coordinatorsData);

          // Combine deanData, postGradProgramsData, and coordinatorsData into allCoordinatorData
          allCoordinatorData.push(deanData, ...coordinatorsData, iqauDirectorData);

          allCoordinatorData = allCoordinatorData.filter((coordinator) => coordinator != null);

          console.log("All Coordinator Data:", allCoordinatorData);
        }

        // Set allCoordinatorData to tableData
        setTableData(allCoordinatorData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [auth.id]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [selectedCoordinatorForEdit, setSelectedCoordinatorForEdit] = useState({
    id: '',
    academicStaff: {
      universitySide: {
        user: {
          initials: '',
          surname: '',
        },
      },
    },
    faculty: {
      name: '',
    },
    role: '',
  });

  // Define openEditPopup function within the Coordinators component
  const handleOpenEditDialog = (coordinator) => {
    setSelectedCoordinatorForEdit(coordinator);
    setIsEditDialogOpen(true);
  };

  const handleAccountRemove = async () => {
    if (selectedCoordinatorForEdit) {
      // Update the tableData with the edited coordinator details
      try{
        let removeResponse = null;
        if(selectedCoordinatorForEdit.role === 'IQAU Director'){
          removeResponse = await removeIQAUDirectorRole(selectedCoordinatorForEdit.id);
        }
        else if(selectedCoordinatorForEdit.role === 'Dean'){
          removeResponse = await removeDeanRole(selectedCoordinatorForEdit.id);
        }
        else if(selectedCoordinatorForEdit.role === 'Programme Coordinator'){
          removeResponse = await removeProgrammeCoordinatorRole(selectedCoordinatorForEdit.id);
        }


        if(removeResponse && removeResponse.status === 200){
          const updatedTableData = tableData.filter((coordinator) => coordinator.id !== selectedCoordinatorForEdit.id);
          setTableData(updatedTableData);
          handleCancelDialog();
          
          //display success message using snackbar
          console.log("Person unassigned successfully");
          setSnackbarMessage("Person unassigned  successfully from the role of " + selectedCoordinatorForEdit.role);
          setSnackbarOpen(true);

          //close the snackbar after 4 seconds
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 4000);
        }
        else{
          console.log("Error unassigning the person from the role of " + selectedCoordinatorForEdit.role);
          setSnackbarMessage("Error unassigning the person from the role of " + selectedCoordinatorForEdit.role);
          setSnackbarOpen(true);

          //close the snackbar after 4 seconds
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 4000);
        }
      }
      catch(error){
        console.log("Error removing coordinator", error);

        setSnackbarMessage("Error unassigning the person from the role of " + selectedCoordinatorForEdit.role);
        setSnackbarOpen(true);

        //close the snackbar after 4 seconds
        setTimeout(() => {
          setSnackbarOpen(false);
        }
        , 4000);
      }

      handleCancelDialog();
    }
  };

  const handleCancelDialog = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => {
      setSelectedCoordinatorForEdit(null);
    }, 500);

  };

  useSetUserNavigations([
    {
      name: 'Dashboard',
      link: '/',
    },
    {
      name: "Browse Accounts",
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
    <>
      <Divider textAlign="left">
        <Chip label='Browse Accounts of Dean, IQAU Director and Programme Coordinators' />
      </Divider>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarOpen}
        message={snackbarMessage}
        key={"top" + "center"}
        severity={snackbarMessage.includes("Error") ? "error" : "success"}
      />


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
            <p>Loading ...</p>
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
        onClose={handleCancelDialog}
        maxWidth="md" // Adjust the width as needed
        fullWidth // Take up the full width
      >
        <DialogTitle style={{ fontSize: "24px", fontWeight: "bold", textAlign: 'center' }}>
          You are about to unassign
          {
            selectedCoordinatorForEdit?.role === 'IQAU Director' ? (
              " " + selectedCoordinatorForEdit?.qualityAssuranceStaff.universitySide.user.initials + " " + selectedCoordinatorForEdit?.qualityAssuranceStaff.universitySide.user.surname
            )
              :
              (
                " " + selectedCoordinatorForEdit?.academicStaff.universitySide.user.initials + " " + selectedCoordinatorForEdit?.academicStaff.universitySide.user.surname
              )
          } from {selectedCoordinatorForEdit?.role} role
        </DialogTitle>
        <DialogContent className="w-full" sx={{ textAlign: 'center' }}>
          Once you unassign the person from the role, it is not possible to revert the changes. Moreover you will need to add a new person to the role.
          Are you sure you want to unassign the person from the role?
        </DialogContent>
        <DialogActions className="mt-4 space-x-2">
          <Button onClick={handleCancelDialog}>No</Button>
          <Button onClick={handleAccountRemove} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Coordinators;
