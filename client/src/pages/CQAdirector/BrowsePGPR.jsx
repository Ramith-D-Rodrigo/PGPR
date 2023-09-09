// BrowsePGPR.jsx

import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { CircularProgress } from "@mui/material";

// Sample data (you can replace this with your actual data)
const dummyData = [
  {
    id: 1,
    requestDate: "2023-08-25",
    applicationDate: "2023-08-26",
    status: "Pending",
    pgProgramName: "Sample Program 1",
  },
  {
    id: 2,
    requestDate: "2023-08-24",
    applicationDate: "2023-08-25",
    status: "Approved",
    pgProgramName: "Sample Program 2",
  },
  // Add more data as needed
];

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
                  <TableCell align="center">{row.pgProgramName}</TableCell>
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
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  const [tableData, setTableData] = useState([]); // Initialize tableData as an empty array

  useEffect(() => {
    // In a real application, you would fetch data from the backend here.
    // For now, we'll use the dummy data.
    setTableData(dummyData);
    setIsLoading(false);
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
