import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
  Autocomplete,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import ScrollableDiv from "../../components/ScrollableDiv";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import useAuth from "../../hooks/useAuth.js";
import getAssignedPGPRs from "../../api/Reviewer/getAssignedPGPRs";

const PgAssignments = () => {
  const { auth } = useAuth();

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
  ]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedFilterKeys, setSelectedFilterKeys] = useState([{ title: "In-review" },]);
  const [AcceptClicked, setAcceptClicked] = useState(false);
  const [acceptAssignment, setAcceptAssignment] = useState(false);
  const [selectedPGPRID, setSelectedPGPRID] = useState(null);
  const [appointmentLetter, setAppointmentLetter] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [assignedPGPRs, setAssignedPGPRs] = useState([]);

  useEffect(() => {
    document.title = "PG Assignments";
    const getPGPRAssignments = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await getAssignedPGPRs();
        console.log("PGPR Assignments : ", response?.data?.data);
        setAssignedPGPRs(response?.data?.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    getPGPRAssignments();
  }, []);

  async function handleSubmitAssignment() {
    console.log("Accept Clicked : ", selectedPGPRID);
    if (appointmentLetter === null) {
      setErrorMsg("Please upload the appointment letter");
      return;
    }
    setAcceptAssignment(false);
    setAcceptClicked(false);
    setLoading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("pgprID", selectedPGPRID);
    formData.append("file", appointmentLetter);
    axios
      .post(
        `${SERVER_URL}${SERVER_API_VERSION}reviewers/accept-pgpr-assignment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("Response : ", response);
        setLoading(false);
        setSuccess(true);
        setErrorMsg("Accepted Successfully!");
        //TODO : reload current assignment data
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setErrorMsg(error.response.data.message);
        } else if (error.response.status === 404) {
          setErrorMsg(error.response.data.message);
        } else {
          console.log("Error : ", error);
          setErrorMsg(error.response.data.message);
        }
        setLoading(false);
      });
  }

  async function handleRejectAssignment() {
    //http://localhost:8000/api/v1/reviewers/reject-pgpr-assignment
    setOpen(false);
    setAcceptClicked(false);
    try {
      setLoading(true);
      setErrorMsg("");
      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.post(
        `${SERVER_URL}${SERVER_API_VERSION}reviewers/reject-pgpr-assignment`,
        {
          pgprID: selectedPGPRID,
          comment: `Rejected PGPR ${selectedPGPRID} by ${auth.fullName}`,
        }
      );
      console.log("Response : ", response);
      setLoading(false);
      setSuccess(true);
      setErrorMsg("Rejected Successfully!");
      //TODO : reload current assignment data
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMsg(error.response.data.message);
      } else if (error.response.status === 404) {
        setErrorMsg(error.response.data.message);
      } else {
        console.log("Error : ", error);
        setErrorMsg(error.response.data.message);
      }
      setLoading(false);
    }
  }

  function handleClickCancel() {
    setAcceptClicked(false);
    setAcceptAssignment(false);
    setSelectedPGPRID(null);
  }

  function handleClickAccept(pgprID) {
    setAcceptClicked(true);
    setSelectedPGPRID(pgprID);
    //console.log("Accept Clicked : ", pgprID);
  }
  
  function createData(
    pgprID,
    University_Name,
    faculty_Name,
    pgp,
    Role,
    status,
    Actions
  ) {
    Actions = Actions.map((action, index) => {
      let allow = action.allow ? { disabled: false } : { disabled: true };
      allow = loading ? { disabled: true } : allow;
      if (action.action === "View") {
        return (
          <Link key={index} to={action.allow ? "ViewSer/" + pgprID : ""}>
            <Button
              {...allow}
              style={{ margin: "0 8px" }}
              variant="contained"
              color="primary"
              size="small"
            >
              {action.action}
            </Button>
          </Link>
        );
      } else if (action.action === "Accept") {
        return (
          <Button
            key={index}
            onClick={() => {
              handleClickAccept(pgprID);
            }}
            {...allow}
            style={{ margin: "0 8px" }}
            variant="contained"
            color="primary"
            size="small"
          >
            {action.action}
          </Button>
        );
      } else if (action.action === "DE") {
        return (
          <Link key={index} to={action.allow ? "Conduct_DE/" + pgprID : ""}>
            <Button
              {...allow}
              style={{ margin: "0 8px" }}
              variant="contained"
              color="primary"
              size="small"
            >
              {action.action}
            </Button>
          </Link>
        );
      } else if (action.action === "PE") {
        return (
          <Link key={index} to={action.allow ? "Conduct_PE/" + pgprID : ""}>
            <Button
              {...allow}
              style={{ margin: "0 8px" }}
              variant="contained"
              color="primary"
              size="small"
            >
              {action.action}
            </Button>
          </Link>
        );
      }
    });
    return {
      pgprID: `PGPR-${pgprID}`,
      University_Name,
      faculty_Name,
      pgp,
      Role,
      status,
      Actions,
    };
  }

  const rows = assignedPGPRs
    ? assignedPGPRs?.map((pgpr) => {
        const PGPRDetails = pgpr?.postGraduateReviewProgram;
        const pgProgramme = PGPRDetails?.postGraduateProgramme;
        const faculty = pgProgramme?.faculty;
        const university = faculty?.university;
        let actions = [];
        if (
          PGPRDetails?.statusOfPgpr === "SUBMITTED" ||
          PGPRDetails?.statusOfPgpr === "PLANNING"
        ) {
          actions = [
            { action: "Accept", allow: true },
            { action: "View", allow: false },
            { action: "DE", allow: false },
            { action: "PE", allow: false },
          ];
        } else if (PGPRDetails?.statusOfPgpr === "DE") {
          actions = [
            { action: "Accept", allow: false },
            { action: "View", allow: true },
            { action: "DE", allow: true },
            { action: "PE", allow: false },
          ];
        } else if (
          PGPRDetails?.statusOfPgpr === "PE1" ||
          PGPRDetails?.statusOfPgpr === "PE2"
        ) {
          actions = [
            { action: "Accept", allow: false },
            { action: "View", allow: true },
            { action: "DE", allow: false },
            { action: "PE", allow: true },
          ];
        } else if (PGPRDetails?.statusOfPgpr === "FINAL") {
          actions = [
            { action: "Accept", allow: false },
            { action: "View", allow: true },
            { action: "DE", allow: false },
            { action: "PE", allow: false },
          ];
        } else if (PGPRDetails?.statusOfPgpr === "COMPLETED") {
          actions = [
            { action: "Accept", allow: false },
            { action: "View", allow: true },
            { action: "DE", allow: false },
            { action: "PE", allow: false },
          ];
        } else {
          actions = [
            { action: "Accept", allow: false },
            { action: "View", allow: false },
            { action: "DE", allow: false },
            { action: "PE", allow: false },
          ];
        }

        return createData(
          PGPRDetails?.id,
          university?.name,
          faculty?.name,
          pgProgramme?.title,
          pgpr?.role,
          PGPRDetails?.statusOfPgpr,
          actions
        );
      })
    : [];

  // const rows = [
  //     createData("Uoc-11",'University of Colombo', "UCSC","MCS","Chairman", 'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
  //     createData("Uoc-13",'University of Colombo', "FOC","MCS", "Reviewer", 'In-review', [{action:'Accept',allow:true},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
  //     createData("Uom-17",'University of Moratuwa', "FOE","MCS", "Chairman",'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:true}, {action:'PE',allow:false}]),
  //     createData("Uok-10",'University of Kelaniya', "FOCS","MCS","Chairman", 'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
  //     createData("Uop-16","University of Peradeniya", "FIT","MCS","Reviewer", 'In-review', [{action:'Accept',allow:true},{action:'View',allow:true}, {action:'DE',allow:true}, {action:'PE',allow:true}]),
  //   ];

  const statuses = [
    { title: "In-review" },
    { title: "Accepted" },
    { title: "Rejected" },
    { title: "Pending" },
  ];

  const customEqualityTest = (option, value) => {
    // console.log("option : value : ",option,value);
    return option.title === value.title;
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: "absolute",
            left: 0,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
            Loading ...
          </Typography>
          <CircularProgress
            style={{ margin: "0 0 0 20px", color: "darkblue" }}
            thickness={5}
            size={24}
          />
        </div>
      )}
      <Typography
        align="center"
        fontWeight={600}
        variant="h5"
        gutterBottom
        component="div"
        style={{ marginRight: "20px" }}
      >
        Postgraduate programme review Assignments
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <Autocomplete
          sx={{ width: "50%", marginBottom: "20px" }}
          multiple
          id="tags-standard"
          options={statuses}
          getOptionLabel={(option) => option.title}
          // defaultValue={[statuses[0]]}
          value={selectedFilterKeys}
          onChange={(event, newValue) => {
            setSelectedFilterKeys(newValue);
            // console.log(newValue);
          }}
          isOptionEqualToValue={customEqualityTest}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Filter by Status"
              placeholder="Select option"
            />
          )}
        />
      </Box>
      <ScrollableDiv height="500px">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="left">
                  <b>PGPR-ID</b>
                </TableCell>
                <TableCell align="center">
                  <b>University Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Faculty/Institute</b>
                </TableCell>
                <TableCell align="center">
                  <b>PGP</b>
                </TableCell>
                <TableCell align="center">
                  <b>Role</b>
                </TableCell>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.pgprID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.pgprID}
                  </TableCell>
                  <TableCell align="center">{row.University_Name}</TableCell>
                  <TableCell align="center">{row.faculty_Name}</TableCell>
                  <TableCell align="center">{row.pgp}</TableCell>
                  <TableCell align="center">{row.Role}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.Actions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollableDiv>
      {AcceptClicked && (
        <Box
          sx={{
            position: "absolute",
            margin: "0 auto",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
            width: "50%",
            height: "90%",
            marginTop: "20px",
            backgroundColor: "#D8E6FC",
            borderRadius: "10px",
            padding: "60px",
            boxShadow: "0 0 5px 0px black",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            style={{ marginRight: "20px" }}
          >
            {acceptAssignment
              ? "Upload the Appointment Letter"
              : "Accept Review Assignment"}
          </Typography>
          {!acceptAssignment && (
            <>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ marginRight: "20px" }}
              >
                Reviewer Name: <b>{auth.fullName}</b>
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ marginRight: "20px" }}
              >
                It&apos;s happy to inform you that you have been appointed as a
                reviewer/Chairman for postgraduate programs by QAC. Click below
                to download the appointment letter.
              </Typography>
              <Link
                to={`${SERVER_URL}${SERVER_API_VERSION}reviewers/download-pgpr-declaration`}
              >
                <Button variant="contained" color="primary" size="large">
                  Download Appointment Letter
                </Button>
              </Link>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setAcceptAssignment(true)}
                >
                  Accept Assignment
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setOpen(true)}
                >
                  Reject Assignment
                </Button>
              </Box>
            </>
          )}
          {acceptAssignment && (
            <>
              <TextField
                sx={{ margin: "15px 0", width: "100%", height: "100%" }}
                id="letter"
                type="file"
                required
                onChange={(e) => {
                  setAppointmentLetter(e.target.files[0]);
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmitAssignment}
                >
                  Submit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setAcceptAssignment(false)}
                >
                  Cancel
                </Button>
              </Box>
            </>
          )}
          <IconButton
            onClick={handleClickCancel}
            style={{ position: "absolute", right: 15, top: 15 }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
        </Box>
      )}

      <Snackbar
        open={errorMsg == "" || success ? false : true}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setErrorMsg("")}
      >
        <Alert onClose={() => setErrorMsg("")} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={1500}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          {errorMsg} 
          {/* on success */}
        </Alert>
      </Snackbar>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="submit-assignment"
      >
        <DialogTitle id="submit-assignmentID">
          {
            "Are you sure that you want to Reject this postgraduate programme review assignment?"
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Once you reject this assignment, you can&apos;t undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            cancel
          </Button>
          <Button onClick={() => handleRejectAssignment()} autoFocus>
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PgAssignments;
