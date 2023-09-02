import React, { useState } from "react";
import MainContent from "../../components/MainContent";
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, TextField, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const CustomTable = ({ tableData, openEditDialog }) => {
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
 // Hardcoded data for the table
  const [tableData, setTableData] = useState([
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
  ]);
  const [selectedCoordinatorForEdit, setSelectedCoordinatorForEdit] = useState(
    tableData[0]
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
    const [searchedFaculty, setSearchedFaculty] = useState("");
  
    const handleSearch = (universityName, facultyName) => {
      setSearchedUniversity(universityName);
      setSearchedFaculty(facultyName);
    };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
        <h2 className="text-2xl font-bold text-center">Browse PG Programs </h2>
        <hr className="border-t-2 border-black my-4 opacity-50" />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="university" className="block font-medium text-gray-700">
              University Name :
            </label>
            <input
              type="text"
              id="university"
              className="form-input border border-black p-1"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="faculty" className="block font-medium text-gray-700">
              Faculty/Institute Name :
            </label>
            <input
              type="text"
              id="faculty"
              className="form-input border border-black p-1"
            />
          </div>
          <div className="flex justify-center items-end col-span-2">
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </div>
      <CustomTable  tableData={tableData}
        openEditDialog={handleOpenEditDialog}
      />

<Dialog
  open={isEditDialogOpen}
  onClose={handleCloseEditDialog}
  maxWidth="md" // Adjust the width as needed
  fullWidth // Take up the full width
>
  <DialogTitle style={{ fontSize: '24px', fontWeight: 'bold' }}>
  Edit PG Program Details
  </DialogTitle>
        <DialogContent className="w-full">
          <form className="dialog-form space-y-4">
          <div className="flex flex-col">
              <label
                htmlFor="pgrpID"
                className="text-sm font-medium text-gray-700"
              >
                PGPR-ID:
              </label>
              <input
                type="text"
                id="pgprID"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.pgprID}
                // Add an onChange handler to update selectedCoordinatorForEdit.cid
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    pgprID: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="coordinator"
                className="text-sm font-medium text-gray-700"
              >
                Coordinator Name:
              </label>
              <input
                type="text"
                id="coordinator"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.coordinator}
                // Add an onChange handler to update selectedCoordinatorForEdit.name
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    coordinator: e.target.value,
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
                htmlFor="pgp"
                className="text-sm font-medium text-gray-700"
              >
                PGP :
              </label>
              <input
                type="text"
                id="pgp"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.pgp}
                // Add an onChange handler to update selectedCoordinatorForEdit.pgCount
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    pgp: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="pgpStatus"
                className="text-sm font-medium text-gray-700"
              >
                Status of (PGP) :
              </label>
              <input
                type="text"
                id="pgpStatus"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCoordinatorForEdit.pgpStatus}
                // Add an onChange handler to update selectedCoordinatorForEdit.pgCount
                onChange={(e) =>
                  setSelectedCoordinatorForEdit((prevState) => ({
                    ...prevState,
                    pgpStatus: e.target.value,
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
    </>
  );
};

export default Coordinators;
