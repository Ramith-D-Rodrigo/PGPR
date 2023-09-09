// BrowsePGPR.jsx

import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { CircularProgress } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import getAllPGPRApplications from "../../api/PostGraduateProgramApplication/getAllPGPRApplications";
import getDean from "../../api/Dean/getDean";


// Sample data (you can replace this with your actual data)

const CustomTable = ({ tableData, openDetailsDialog, openRecommendDialog }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center"><b>ID</b></TableCell>
                <TableCell align="center"><b>Request Date</b></TableCell>
                <TableCell align="center"><b>Application Date</b></TableCell>
                <TableCell align="center"><b>Status</b></TableCell>
                <TableCell align="center"><b>Dean Name</b></TableCell>
                <TableCell align="center"><b>PG Program Name</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{row.requestDate}</TableCell>
                  <TableCell align="center">{row.applicationDate}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.deanName}</TableCell>
                  <TableCell align="center">{row.postGraduateProgram.title}</TableCell>
                  <TableCell align="center">
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => openDetailsDialog(row)}
                    >
                      View Details
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => openRecommendDialog(row)}
                    >
                      Recommend
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

const BrowsePGPR = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch PGPR applications from the backend using the getAllPGPRApplications API call
        const response = await getAllPGPRApplications({
          includePostGraduateProgram: true, // Include postgraduate program details
          includeFaculty: true, // Include faculty details (since includePostGraduateProgram is true)
          includeUniversity: true, // Include university details (since includeFaculty is true)
        });
  
        const pgprApplicationsData = response.data.data;
  
        // Log the fetched data
        console.log('PGPR Applications Data:', pgprApplicationsData);
  
        // Now, you can fetch dean details for each PGPR application
        const updatedTableData = await Promise.all(
          pgprApplicationsData.map(async (pgpr) => {
            const deanResponse = await getDean(pgpr.deanId, {
              includeAcademicStaff: true,
              includeUniversitySide: true,
              includeUser: true,
            });
  
            const deanData = deanResponse.data.data;
            console.log('Dean Data for PGPR Application', pgpr.id, ':', deanData);
  
            // Update other properties as needed
            // pgpr.propertyName = deanData.propertyName;
  
            pgpr.deanName = `${deanData.academicStaff.universitySide.user.initials} ${deanData.academicStaff.universitySide.user.surname}`;
            return pgpr;
          })
        );
  
        // Log the updated tableData
        console.log('Updated Table Data:', updatedTableData);
  
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
  

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
        <h2 className="text-2xl font-bold text-center">Browse PGPR Applications</h2>
        <hr className="border-t-2 border-black my-4 opacity-50" />
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
          <CustomTable tableData={tableData} />
        )}
      </div>
    </>
  );
};


export default BrowsePGPR;
