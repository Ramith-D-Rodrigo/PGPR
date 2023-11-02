// BrowsePGPR.jsx

import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { CircularProgress } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import getAllPGPRApplications from "../../api/PostGraduateProgramApplication/getAllPGPRApplications";
import getDean from "../../api/Dean/getDean";
import recommendPGPRApplicationByCQADirector from "../../api/PostGraduateProgramApplication/recommendPGPRApplicationByCQA";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import { SERVER_URL } from "../../assets/constants";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


// Sample data (you can replace this with your actual data)

const CustomTable = ({
  tableData,
  openDetailsDialog,
  handleRecommendClick,
  isRecommendButtonDisabledArray, // Add this prop
}) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center">
                  <b>ID</b>
                </TableCell>
                <TableCell align="center">
                  <b>Request Date</b>
                </TableCell>
                <TableCell align="center">
                  <b>Application Date</b>
                </TableCell>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
                <TableCell align="center">
                  <b>Dean Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>PG Program Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
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
                  <TableCell align="center">
                    {row.postGraduateProgram.title}
                  </TableCell>
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
                    {
                      
                      <Button
                        style={{ margin: "0 8px" }}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleRecommendClick(row, index)} // Pass the index
                        disabled={row.status !== "submitted"} // Use the array value
                      >
                        Recommend
                      </Button>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Box mt={2} display="flex" justifyContent="center"></Box>
    </div>
  );
};

const BrowsePGPR = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [selectedPGPR, setSelectedPGPR] = useState(null); // State to store selected PGPR application
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false); // State to manage dialog open/close
  const [isRecommendButtonDisabledArray, setIsRecommendButtonDisabledArray] = useState(Array(tableData.length).fill(false));
  const { auth } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [wait, setWait] = useState(false);


  useSetUserNavigations([
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Postgraduate Programme Review Applications",
      link: "/pgprs",
    },
  ]);

  const handleRecommendClick = async (pgpr, rowIndex) => {
    // Disable the button for the specific row
    setIsRecommendButtonDisabledArray((prevArray) => {
      const newArray = [...prevArray];
      newArray[rowIndex] = true;
      return newArray;
    });

    try {
      setWait(true);

      const response = await recommendPGPRApplicationByCQADirector(pgpr.id);

      if (response.status === 200) {
        // Recommendation was successful
        setSuccessMsg(response.data.message);

        //disable the button
        setIsRecommendButtonDisabledArray((prevArray) => {
          const newArray = [...prevArray];
          newArray[rowIndex] = true;
          return newArray;
        });

      } else {
        // Recommendation failed
        setErrorMsg(response.data.message);
      }
    } catch (error) {
      console.error("Error recommending PGPR application:", error);
      setErrorMsg(error.response.data.message);
    } finally {

      setWait(false);
      setIsRecommendButtonDisabledArray((prevArray) => {
        const newArray = [...prevArray];
        newArray[rowIndex] = false;
        return newArray;
      });
    }
  };

  // Function to open the dialog and set the selected PGPR application
  const openDetailsDialog = (pgpr) => {
    setSelectedPGPR(pgpr);
    setIsDetailsDialogOpen(true);
    console.log("Selected PGPR Application:", pgpr); // Log the selected PGPR application
  };

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
        console.log("PGPR Applications Data:", pgprApplicationsData);

        // Now, you can fetch dean details for each PGPR application
        const updatedTableData = await Promise.all(
          pgprApplicationsData.map(async (pgpr) => {
            const deanResponse = await getDean(pgpr.deanId, {
              includeAcademicStaff: true,
              includeUniversitySide: true,
              includeUser: true,
            });

            const deanData = deanResponse.data.data;
            console.log(
              "Dean Data for PGPR Application",
              pgpr.id,
              ":",
              deanData
            );

            // Update other properties as needed
            // pgpr.propertyName = deanData.propertyName;

            pgpr.deanName = `${deanData.academicStaff.universitySide.user.initials} ${deanData.academicStaff.universitySide.user.surname}`;
            return pgpr;
          })
        );

        // Log the updated tableData
        console.log("Updated Table Data:", updatedTableData);

        // Set the updated tableData to the state
        setTableData(updatedTableData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const downloadIntentLetter = () => {
    window.open(SERVER_URL.slice(0, -1) + selectedPGPR.intentLetter);
  };

  return (
    <>
      <Snackbar
        open={errorMsg == "" ? false : true}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setErrorMsg("")}
      >
        <Alert onClose={() => setErrorMsg("")} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={successMsg == "" ? false : true}
        autoHideDuration={1500}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMsg("")} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={wait}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="info">
          Please wait...
        </Alert>
      </Snackbar>

      <Divider textAlign="left">
        <Chip label="Browse PGPR Applications" />
      </Divider>
      <>
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
            openDetailsDialog={openDetailsDialog}
            handleRecommendClick={handleRecommendClick}
            isRecommendButtonDisabledArray={isRecommendButtonDisabledArray} // Pass the array as a prop
          />
        )}
      </>

      {/* Details Dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        fullWidth
      // You can adjust the width as needed
      >
        {selectedPGPR && (
          <>
            <DialogTitle style={{ textAlign: "center" }}>
              <b>PGPR Application Details</b>
              <IconButton
                aria-label="close"
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "8px",
                  color: "red",
                }}
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  ID
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.id}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Request Date
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.requestDate}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Application Date
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.applicationDate}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Status
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.status}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Dean Name
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.deanName}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  PG Program Name
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.postGraduateProgram.title}
                </div>
              </div>
              {/* Display data for all 5 years */}
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 1
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.year1}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 2
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.year2}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 3
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.year3}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 4
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.year4}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 5
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.year5}
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', margin: '0.5rem 0' }}>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  Year 5 End Date
                </div>
                <div style={{ width: '50%', margin: '0 0 0 20%' }}>
                  {selectedPGPR.yEnd}
                </div>
              </div>
              {/* Add a button to download intent letter */}
              <div style={{ textAlign: "center" }}>
                <Button variant="contained" color="primary" onClick={downloadIntentLetter}>
                  Download Intent Letter
                </Button>
              </div>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default BrowsePGPR;
