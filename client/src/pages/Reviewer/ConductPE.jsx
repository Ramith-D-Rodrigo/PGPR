import { useEffect, useState } from "react";
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
  Divider,
  Chip,
} from "@mui/material";

import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import useAuth from "../../hooks/useAuth";

const ConductPE = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { auth } = useAuth();
  const { pgprId } = useParams();

  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openCriteriaDialog, setOpenCriteriaDialog] = useState(false);
  const [PEEndDate, setPEEndDate] = useState("");
  

  const [criteriaList, setCriteriaList] = useState([
    { name: "Programme Evaluation", id: 1 },
    { name: "Student Assessment & Awards", id: 2 },
    { name: "Innovative & Healthy Practices", id: 3 },
    { name: "Programme Management", id: 4 },
    { name: "P. Design and Development", id: 5 },
    { name: "Human Physical Res. & LS", id: 6 },
    { name: "Teaching Learning Research", id: 7 },
  ]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState([
    { name: "Programme Management", id: 4 },
    { name: "P. Design and Development", id: 5 },
    { name: "Human Physical Res. & LS", id: 6 },
  ]);
  const [reviewerCreitriaList, setReviewerCreitriaList] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");

  const [isChair, setIsChair] = useState(false);
  const [pgpr, setPgpr] = useState({});
  const [programData, setProgramData] = useState({
    title: "",
    slqfLevel: null,
    coordinator: "",
    commencementYear: null,
    faculty: "",
    university: "",
    applicationDate: "",
    requestDate: "",
    yearEnd: "",
  });
  const [PEData, setPEData] = useState({});

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
          const reviewers = team?.reviewers;
          const chair = reviewers?.find(
            (reviewer) => reviewer?.role === "CHAIR"
          );
          const chairReviewer = chair?.userData;
          const chairId = chairReviewer?.id;
          if (chairId === auth?.id) {
            setIsChair(true);
          }

          const programApplication = pgprResponse?.data?.data?.postGraduateProgramReviewApplication;
          const applicationDate = programApplication?.applicationDate;
          const requestDate = programApplication?.requestDate;
          const yearEnd = programApplication?.yEnd;

          const program = pgprResponse?.data?.data?.postGraduateProgramme;
          const title = program?.title;
          const slqfLevel = program?.slqfLevel;
          const commencementYear = program?.commencementYear;
          const facultyData = program?.faculty;
          const faculty = facultyData?.name;
          const universityData = facultyData?.university;
          const university = universityData?.name;

          const ser = pgprResponse?.data?.data?.selfEvaluationReport;
          const coordinatorData = ser?.programmeCoordinator;
          const academic = coordinatorData?.academicStaff;
          const universitySideDetails = academic?.universitySide;
          const coordinatorUser = universitySideDetails?.user;
          const coordinator = coordinatorUser?.initials + " . " + coordinatorUser?.surname;

          setProgramData({
            title,
            slqfLevel,
            coordinator,
            commencementYear,
            faculty,
            university,
            applicationDate,
            requestDate,
            yearEnd,
          });

          //console.log("Program : ", programData);
          //console.log("Team : ", team);
          const PEResponse = await axios.get(
            `${SERVER_URL}${SERVER_API_VERSION}review-team/proper-evaluation/view-details/${pgprId}/${team?.id}`
          );
          console.log("PE Data : ", PEResponse?.data?.data);
          setPEData(PEResponse?.data?.data);
        }
      } catch (error) {
        setErrorMsg(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pgprId, auth?.id]);

  //console.log("CHAIR : ", isChair)

  const handleSetDate = (openDateDialog) => {
    console.log(openDateDialog);
    setPEEndDate("");
    setOpenDateDialog(false);
  }

  const HandleselectCriteria = (e,id) => {
    e.target.style.backgroundColor = "black";
    e.target.style.color = "white";
    //if already selected
    if(reviewerCreitriaList.some((criteria)=>criteria.id===id)){
      e.target.style.backgroundColor = "white";
      e.target.style.color = "black";
      setReviewerCreitriaList(reviewerCreitriaList.filter((criteria)=>criteria.id!==id));
      return;
    }
    setReviewerCreitriaList([...reviewerCreitriaList,{name:criteriaList.find((criteria)=>criteria.id===id).name,id:id}]);
  }

  const handlesetCriteria = () => {
    if(reviewerCreitriaList.length===0){
      alert("Please select at least one criteria");
      return;
    }
    console.log(reviewerCreitriaList);
    setOpenCriteriaDialog(false);
    setReviewerCreitriaList([]);
    //get PGPR data again
  }

 

  // const headerInfo = [
  //   { label: "University:", value: "University of Colombo" },
  //   {
  //     label: "Faculty/Institute:",
  //     value: "University of Colombo School of Computing",
  //   },
  //   { label: "PGPR ID:", value: decodedPgprId },
  //   { label: "PGPR Name:", value: "MSc" },
  //   { label: "Application Start Date:", value: "12/12/2020" },
  //   { label: "Submission Date:", value: "01/01/2021" },
  //   { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
  // ];

  // const rows = [
  //   {
  //     name: "John Doe",
  //     designation: "Professor",
  //     status: "Reviewer",
  //     listOfCriteria: [
  //     ],
  //     actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
  //   },
  //   {
  //     name: "Jane Smith",
  //     designation: "Associate Professor",
  //     status: "Reviewer",
  //     listOfCriteria: ["Programme Management", "P. Design and Development"],
  //     actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
  //   },
  //   {
  //     name: "Michael Johnson",
  //     designation: "Assistant Professor",
  //     status: "Chair",
  //     listOfCriteria: [
  //       "Human Physical Res. & LS",
  //     ],
  //     actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
  //   },
  // ];

  const finalButtons = [
    {
      title: "Proceed to Proper Evaluation",
      to: `../Assigned_criteria/${pgprId}`,
    },
  ];
  //only for chair
  if (isChair) {
    finalButtons.push(
      {
        title: "Set Dates for Proper Evaluation",
        to: "",
      },
    );
  }
  
  return (
    <>
      {loading && <p>Loading...</p>}
      {errorMsg && <p>{errorMsg}</p>}
      {pgpr && (
        <DiscriptiveDiv
          description="PG Program"
          width="100%"
          height="auto"
          backgroundColor="#D8E6FC"
        >
          <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
              <Typography textAlign="left">
                <strong>PGPR ID : </strong>
                PGPR-{pgprId}
              </Typography>
              <Typography textAlign="left">
                <strong>PGPR Name : </strong>
                {programData.title}
              </Typography>
              <Typography textAlign="left">
                <strong>SLQF Level : </strong>
                {programData.slqfLevel}
              </Typography>
              <Typography textAlign="left">
                <strong>Program Coordinator : </strong>
                {programData.coordinator}
              </Typography>
              <Typography textAlign="left">
                <strong>Commencement Year : </strong>
                {programData.commencementYear}
              </Typography>
            </Grid>
            <Grid item sm={12} md={6}>
              <Typography textAlign="left">
                <strong>University : </strong>
                {programData.university}
              </Typography>
              <Typography textAlign="left">
                <strong>Faculty/Institute : </strong>
                {programData.faculty}
              </Typography>
              <Typography textAlign="left">
                <strong>Application Start Date : </strong>
                {programData.applicationDate}
              </Typography>
              <Typography textAlign="left">
                <strong>Request Date : </strong>
                {programData.requestDate}
              </Typography>
              <Typography textAlign="left">
                <strong>End Date : </strong>
                {programData.yearEnd}
              </Typography>
            </Grid>
          </Grid>
        </DiscriptiveDiv>
      )}

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
                        startDate: "12/12/2020",
                        endDate: "01/01/2021",
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

      <Dialog
        fullScreen={fullScreen}
        open={openDateDialog ? true : false}
        onClose={() => setOpenDateDialog(false)}
        aria-labelledby="Set-PE-Date"
      >
        <DialogTitle id="Set-PE-Date-ID">
          {`Set the Proper Evaluation Date for ${openDateDialog.id} postgraduate programme review`}
        </DialogTitle>
        <DialogContent>
          <p>
            Start Date : <strong>{openDateDialog.startDate}</strong>
          </p>
          <p>
            End Date : <strong>{openDateDialog.endDate}</strong>
          </p>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
              height: "100%",
              margin: "1rem 0",
            }}
          >
            <TextField
              id="setEndDate"
              value={PEEndDate}
              helperText="Please select the end date for the Proper Evaluation"
              variant="standard"
              onChange={(e) => setPEEndDate(e.target.value)}
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

      <Dialog
        fullScreen={fullScreen}
        open={openCriteriaDialog}
        onClose={() => {
          setOpenCriteriaDialog(false);
          setReviewerCreitriaList([]);
        }}
        aria-labelledby="Set-PE-Date"
      >
        <DialogTitle id="Set-PE-Date-ID">
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
              selectedCriteriaList.some(
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
                disabled
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