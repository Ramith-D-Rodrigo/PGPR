import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
} from "@mui/material";

import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";
import useAuth from "../../hooks/useAuth";

const ConductPE = () => {
  const { auth } = useAuth();
  const theme = useTheme();

  //Set up dates for start date and end date
  const currentDate = new Date().toISOString().split("T")[0];
  const date = new Date(currentDate);
  date.setDate(date.getDate()+1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const minDate = `${year}-${month}-${day}`;

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openCriteriaDialog, setOpenCriteriaDialog] = useState(false);

  const [PEEndDate, setPEEndDate] = useState("");
  const [PEMeetingDate, setPEMeetingDate] = useState("");
  const { pgprId } = useParams();

  const [criteriaList, setCriteriaList] = useState([]);
  const [reviewerCreitriaList, setReviewerCreitriaList] = useState([]);
  const [allSelectedCriteriaList, setAllSelectedCriteriaList] = useState([]);
  const [allTemporary, setAllTemporary] = useState([]); 
  const [selectedReviewer, setSelectedReviewer] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pgpr, setPgpr] = useState({});
  const [programData, setProgramData] = useState({
    title: "",
    slqfLevel: "",
    coordinator: "",
    commencementYear: "",
    faculty: "",
    university: "",
    applicationDate: "",
    requestDate: "",
    yearEnd: "",
  });
  const [PEData, setPEData] = useState([]);
  const [chairId, setChairId] = useState("");
  const [isChair, setIsChair] = useState(false);
  const [reviewTeam, setReviewTeam] = useState({});
  const [reviewers, setReviewers] = useState([]);

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "Proper Evaluation",
      link: `/PG_Assignments/Conduct_PE/${pgprId}`,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const pgprResponse = await getPGPR(pgprId);
        //console.log("PGPR : ", pgprResponse?.data?.data);
        setPgpr(pgprResponse?.data?.data);

        if (pgprResponse?.data?.data) {
          const team = pgprResponse?.data?.data?.acceptedReviewTeam;
          setReviewTeam(team);

          const reviewerDetails = team?.reviewers;
          //console.log("team : ", team);
          setReviewers(reviewerDetails);
          //console.log("Reviewers : ", reviewers);

          const chair = reviewerDetails?.find(
            (reviewer) => reviewer?.role === "CHAIR"
          );
          const chairReviewer = chair?.userData;
          setChairId(chairReviewer?.id);
          //console.log("Chair : ", chairReviewer?.id);
          if (chairId === auth?.id) {
            setIsChair(true);
          }

          const programApplication =
            pgprResponse?.data?.data?.postGraduateProgramReviewApplication;
          const applicationDate = programApplication?.applicationDate;
          const requestDate = programApplication?.requestDate;

          const program = pgprResponse?.data?.data?.postGraduateProgramme;
          const title = program?.title;
          const slqfLevel = program?.slqfLevel;
          const facultyData = program?.faculty;
          const faculty = facultyData?.name;
          const universityData = facultyData?.university;
          const university = universityData?.name;

          const ser = pgprResponse?.data?.data?.selfEvaluationReport;
          //console.log("SER : ", ser);
          const coordinatorData = ser?.programmeCoordinator;
          const academic = coordinatorData?.academicStaff;
          const universitySideDetails = academic?.universitySide;
          const coordinatorUser = universitySideDetails?.user;
          const coordinator = coordinatorUser?.initials + " . " + coordinatorUser?.surname;
          const criteria = ser?.criterias;

          setCriteriaList(criteria);
          //console.log("Criteria List : ", criteriaList);

          setProgramData({
            title,
            slqfLevel,
            coordinator,
            faculty,
            university,
            applicationDate,
            requestDate,
          });

          //console.log("Program : ", programData);
          //console.log("Team : ", team);
          const PEResponse = await axios.get(
            `${SERVER_URL}${SERVER_API_VERSION}review-team/proper-evaluation/view-details/${pgprId}/${team?.id}`
          );
          //console.log("PE Data : ", PEResponse?.data?.data);
          setPEData(PEResponse?.data?.data);
        }
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pgprId, auth?.id, chairId]);

  useEffect(() => {
    const allSelectedCriteria = mergeAndDeDuplicate(PEData);
    setAllSelectedCriteriaList(allSelectedCriteria);
    setAllTemporary(allSelectedCriteria);
    //console.log("All Selected Criteria : ", allSelectedCriteria);
  }, [PEData]);

  //console.log("PE : ", PEData);

  const handleSetDate = () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const data = {
        pgprId,
        startDate: currentDate,
        meetingDate: PEMeetingDate,
        endDate: PEEndDate,
      };

      //console.log("Set Date data : ", data);

      axios.get("/sanctum/csrf-cookie");
      axios.post(
        `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/set-dates/phase-one`,
        data
      );
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    }
    setPEEndDate("");
    setOpenDateDialog(false);
  };

  const HandleselectCriteria = (e, id) => {
    //console.log("selected re : ", selectedReviewer);
    e.target.style.backgroundColor = "black";
    e.target.style.color = "white";
    //if already selected
    if (reviewerCreitriaList.some((criteria) => criteria.id === id)) {
      e.target.style.backgroundColor = "white";
      e.target.style.color = "black";
      setReviewerCreitriaList(
        reviewerCreitriaList.filter((criteria) => criteria.id !== id)
      );
      return;
    }
    setReviewerCreitriaList([
      ...reviewerCreitriaList,
      {
        name: criteriaList.find((criteria) => criteria.id === id).name,
        id: id,
      },
    ]);
  };

  const HandleUnselectCriteria = (e, id) => {
    const updatedReviewerCreitriaList = reviewerCreitriaList.filter(
      (criteria) => criteria.id !== id
    );
    const updateTemporary = allTemporary.filter(
      (criteria) => criteria.id !== id
    );
    setAllTemporary(updateTemporary);
    setReviewerCreitriaList(updatedReviewerCreitriaList);
  }

  const handlesetCriteria = () => {
    if (reviewerCreitriaList.length === 0) {
      alert("Please select at least one criteria");
      return;
    }
    //console.log(reviewerCreitriaList);
    assignCriteria();
    setOpenCriteriaDialog(false);
    //get PGPR data again
  };

  async function assignCriteria () {
    try {
      setLoading(true);
      setErrorMsg("");

      // console.log("Assign Criteria team id : ", reviewTeam?.id);
      // console.log("Assign Criteria re id : ", selectedReviewer?.id);
      // console.log(
      //   "Assign Criteria cr list : ",
      //   reviewerCreitriaList.map((criteria) => criteria.id)
      // );

      const data = {
        reviewTeamId: reviewTeam?.id,
        reviewers: [
          {
            reviewerId: selectedReviewer?.id,
            criteria: reviewerCreitriaList.map((criteria) => criteria.id),
          },
        ],
      };

      console.log("Assign Criteria data : ", data);

      await axios.get("/sanctum/csrf-cookie");
      await axios.post(
        `${SERVER_URL}${SERVER_API_VERSION}review-team-chair/proper-evaluation/assign-criteria`,
        data  
      );
      setReviewerCreitriaList([]);
    } catch (error) {
      setErrorMsg(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  //console.log("Reviewers : ", reviewers);

  const rows = reviewers 
    ? reviewers?.map((reviewer) => {
      const userData = reviewer?.userData;
      const id = userData?.id;
      const name = userData?.initials + " . " + userData?.surname;
      const role = reviewer?.role=== "CHAIR" ? "Review Chair Person" : "Review Team Member";

      const reviewerCriterias = PEData?.find(peData => peData?.reviewer?.id === id)?.criteria;
      
      const listOfCriteria = reviewerCriterias 
      ? reviewerCriterias.map(reviewerCriteria => reviewerCriteria) : [];

      //console.log("List Criterias : ", listOfCriteria);

      return {
        id,
        name,
        role,
        listOfCriteria,
      };  
    }) : [];

  function mergeAndDeDuplicate (PEData) {
    let merged = {};
    PEData?.forEach(peData => {
      peData?.criteria?.forEach(child => {
        const key = `${child?.id}_${child?.name}`;
        if (!merged[key]) {
          merged[key] = child;
        }
      });
    });
    //console.log("All Selected Criteria : ", merged);
    return Object.values(merged);
  }
  
  //console.log("Rows : ", rows)

  const finalButtons = [
    {
      title: "Proceed to Proper Evaluation",
      to: `../Assigned_criteria/${pgprId}`,
    },
  ];
  //only for chair
  if (isChair) {
    finalButtons.push({
      title: "Set Dates for Proper Evaluation",
      to: "",
    });
  }

  return (
    <>
      <DiscriptiveDiv
        description="PG Program"
        width="100%"
        height="auto"
        backgroundColor="#D8E6FC"
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>PGPR ID</b>
            </Typography>
            <Typography>{pgprId}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>PG Program Title</b>
            </Typography>
            <Typography>{programData.title}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>SLQF Level</b>
            </Typography>
            <Typography>{programData.slqfLevel}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Program Coordinator</b>
            </Typography>
            <Typography>{programData.coordinator}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Faculty/Institute</b>
            </Typography>
            <Typography>{programData.faculty}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>University</b>
            </Typography>
            <Typography>{programData.university}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Application Date</b>
            </Typography>
            <Typography>{programData.applicationDate}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Request Date</b>
            </Typography>
            <Typography>{programData.requestDate}</Typography>
          </Grid>
        </Grid>
      </DiscriptiveDiv>

      <DiscriptiveDiv
        description="Proper Evaluation"
        width="100%"
        height="auto"
        backgroundColor="white"
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
                  <b>Name</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Role</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>List of Criterian</b>
                </TableCell>
                {isChair ? (
                  <TableCell
                    style={{ backgroundColor: "#D8E6FC" }}
                    align="center"
                  >
                    <b>Actions</b>
                  </TableCell>
                ) : (
                  ""
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.role}</TableCell>
                  <TableCell align="center">
                    {row.listOfCriteria.length === 0 ? (
                      <Typography color="primary">
                        No Criteria Selected
                      </Typography>
                    ) : (
                      <ul
                        style={{
                          listStyleType: "disc",
                          textAlign: "left",
                          paddingLeft: "20%",
                        }}
                      >
                        {row.listOfCriteria.map((criteriaItem, index) => (
                          <li key={index}>
                            <Typography>{criteriaItem.name}</Typography>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                  {isChair ? (
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          setOpenCriteriaDialog(true),
                            setSelectedReviewer({
                              id: row.id,
                              name: row.name,
                            });
                          setReviewerCreitriaList(row.listOfCriteria);
                        }}
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: "#A2CBEA",
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  ) : (
                    ""
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DiscriptiveDiv>

      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        sx={{ padding: { xs: "10px 0", sm: "20px 0" } }}
      >
        {finalButtons.map((buttonItem, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Button
              onClick={
                index === 1
                  ? () =>
                      setOpenDateDialog({
                        id: pgprId,
                      })
                  : null
              }
              variant="contained"
              size="small"
              fullWidth
              style={{
                backgroundColor: "#A2CBEA",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
              component={Link}
              to={buttonItem.to}
            >
              {buttonItem.title}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/*
       *  Dialog Box for Set Date
       */}
      <Dialog
        fullScreen={fullScreen}
        open={openDateDialog ? true : false}
        onClose={() => setOpenDateDialog(false)}
        aria-labelledby="Set-PE-Date"
      >
        <DialogTitle id="Set-PE-Date-ID">
          {`Set the Date for Proper Evaluation #1`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
              margin: "1rem 0",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              padding="0.5rem"
              backgroundColor="#D8E6FC"
              margin="0.5rem 0"
            >
              <InputLabel htmlFor="setStartDate">Start Date : </InputLabel>
              <Typography id="setStartDate">{currentDate}</Typography>
            </Box>
            <InputLabel htmlFor="setEndDate">End Date</InputLabel>
            <TextField
              id="setEndDate"
              value={PEEndDate}
              inputProps={{ min: minDate }}
              helperText="Please select the end date for the Proper Evaluation"
              variant="standard"
              onChange={(e) => setPEEndDate(e.target.value)}
              type="date"
            />
            <InputLabel htmlFor="setMeetingDate">Meeting Date</InputLabel>
            <TextField
              id="setMeetingDate"
              value={PEMeetingDate}
              inputProps={{ min: currentDate, max: PEEndDate }}
              helperText="Please select next meeting date for the Proper Evaluation"
              variant="standard"
              onChange={(e) => setPEMeetingDate(e.target.value)}
              type="date"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpenDateDialog(false)}>
            cancel
          </Button>
          <Button onClick={() => handleSetDate(openDateDialog)} autoFocus>
            Set Date
          </Button>
        </DialogActions>
      </Dialog>

      {/*
       *  Dialog Box for Set Criteria
       */}
      <Dialog
        fullScreen={fullScreen}
        open={openCriteriaDialog}
        onClose={() => {
          setOpenCriteriaDialog(false);
          setReviewerCreitriaList([]);
        }}
        aria-labelledby="Set-Criteria"
      >
        <DialogTitle id="Set-Criteria-ID">
          {`Select the criteria for ${selectedReviewer.name} :`}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
              margin: "1rem 0",
            }}
          >
            {criteriaList.map((criteria, index) =>
              allTemporary.some(
                (selectedCriteria) => selectedCriteria.id === criteria.id
              ) ? (
                ""
              ) : (
                <Button
                  key={index}
                  onClick={(e) => HandleselectCriteria(e, criteria.id)}
                  style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    padding: "0.4rem 0.5rem",
                    margin: "0.5rem 0.5rem 0 0",
                    color: "black",
                  }}
                >
                  {criteria.name}
                </Button>
              )
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
              margin: "2rem 0",
            }}
          >
            {reviewerCreitriaList.length > 0 && (
              <strong>Selected Criteria</strong>
            )}
            {reviewerCreitriaList.map((criteria, index) => (
              <Button
                key={index}
                onClick={(e) => HandleUnselectCriteria(e, criteria.id)}
                style={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "0.4rem 0.5rem",
                  margin: "0.5rem 0.5rem 0 0",
                  backgroundColor: "darkblue",
                  color: "white",
                }}
              >
                {criteria.name}
              </Button>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setOpenCriteriaDialog(false);
              setReviewerCreitriaList([]);
            }}
          >
            cancel
          </Button>
          <Button onClick={() => handlesetCriteria()} autoFocus>
            Set Criteria
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConductPE;