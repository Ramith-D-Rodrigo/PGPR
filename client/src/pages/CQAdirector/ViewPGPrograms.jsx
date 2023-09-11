import React, { useState, useEffect } from "react";
import MainContent from "../../components/MainContent";
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import getCQADirectorUniversity from "../../api/CQADirector/getCQADirectorUniversity";
import getUniversityPostGraduatePrograms from "../../api/University/getUniversityPostGraduatePrograms";
import getCurrentCoordinator from "../../api/PostGraduateProgram/getCurrentCoordinator";


const CustomTable = ({ tableData, openEditDialog }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center"><b>Title</b></TableCell>
                <TableCell align="center"><b>SLQF Level</b></TableCell>
                <TableCell align="center"><b>Commencement Year</b></TableCell>
                <TableCell align="center"><b>Is Proffessional Program</b></TableCell>
                <TableCell align="center"><b>Program Coordinator</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.slqfLevel}</TableCell>
                  <TableCell align="center">{row.commencementYear}</TableCell>
                  <TableCell align="center">{row.isProfessionalPgProgramme === 1 ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">{row.coordinatorName.academicStaff.universitySide.user.initials +" " +
                      row.coordinatorName.academicStaff.universitySide.user.surname}</TableCell>
                  <TableCell align="center">
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      component={Link}
                      to={"PGPrograms/" + row.pgprID}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Box mt={2} display="flex" justifyContent="center">
        
      </Box>
    </div>
  );
};

const Coordinators = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const { auth } = useAuth();
  const [tableData, setTableData] = useState([]); // Initialize tableData as an empty array
  const [university, setUniversity] = useState(null); // Add this state to store university data
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from the backend using API calls
        const cqaDirectorId = auth.id;
        console.log('cqaDirectorId:', cqaDirectorId); // Log cqaDirectorId
        const response = await getCQADirectorUniversity(cqaDirectorId);
        const universityData = response.data.data;
        console.log('universityData:', universityData); // Log universityData
        setUniversity(universityData);

        const universityId = universityData.id;
        console.log('universityId:', universityId); // Log universityId

        const queryParams = {
          includeAcademicStaff: true,
          includeUniversitySide: true,
          includeUser: true,
        };
        // Fetch postgraduate programs of the university
        const programsResponse = await getUniversityPostGraduatePrograms(universityId);
        const programsData = programsResponse.data.data;
        console.log('programsData:', programsData); // Log programsData


        // Fetch coordinators for each postgraduate program and update the tableData
        const updatedTableData = await Promise.all(
          programsData.map(async (program) => {
            const coordinatorResponse = await getCurrentCoordinator(program.id,queryParams); // Pass the postgraduate program id
            const coordinatorData = coordinatorResponse.data.data;
            console.log('coordinatorData for program', program.id, ':', coordinatorData); // Log coordinatorData
            program.coordinatorName = coordinatorData; // Store coordinator name
            return program;
          })
        );

        // Log the updated tableData
        console.log('updatedTableData:', updatedTableData);

        // Set the updated tableData to the state
        setTableData(updatedTableData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);
   
  // const [selectedCoordinatorForEdit, setSelectedCoordinatorForEdit] = useState(
  //   tableData[0]
  // );

  //   // Define openEditPopup function within the Coordinators component
  //   const handleOpenEditDialog = (coordinator) => {
  //     setSelectedCoordinatorForEdit(coordinator);
  //     setIsEditDialogOpen(true);
  //   };
  
  //   const handleSaveEdit = () => {
  //     if (selectedCoordinatorForEdit) {
  //       // Update the tableData with the edited coordinator details
  //       const updatedTableData = tableData.map((coordinator) =>
  //         coordinator.cid === selectedCoordinatorForEdit.cid
  //           ? selectedCoordinatorForEdit
  //           : coordinator
  //       );
  
  //       setTableData(updatedTableData);
  //       handleCloseEditDialog();
  //     }
  //   };
  
  //   const handleCloseEditDialog = () => {
  //     setSelectedCoordinatorForEdit(null);
  //     setIsEditDialogOpen(false);
  //   };
    useSetUserNavigations([
      {
        name: "View Program Coordinators",
        link: "/ViewCoordinators",
      },
    ]);
  

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
        <h2 className="text-2xl font-bold text-center">Browse PG Programs </h2>
        <hr className="border-t-2 border-black my-4 opacity-50" />
        <div className="grid grid-cols-2 gap-4">
         
         </div>
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
            <p>Loading ...</p>
            <CircularProgress style={{ marginLeft: "8px" }} />
          </div>
        </div>
      ) : (
        // Render the table when not loading
        <CustomTable
          tableData={tableData}
         
        />
      )}

    </>
  );
};

export default Coordinators;
