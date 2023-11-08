import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Divider,
  Tabs,
  Tab,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";

//import useDrawerState from "../../hooks/useDrawerState";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import axios from "../../api/api";
import { SERVER_API_VERSION, SERVER_URL } from "../../assets/constants";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import getAssignedPGPR from "../../api/Reviewer/getAssignedPGPR";
import getStandardEvidencesAndAdherenceForSER from "../../api/SelfEvaluationReport/getStandardEvidencesAndAdherenceForSER";
import getSpecificPGPR from "../../api/Reviewer/getSpecificPGPR";
import {CircularProgress} from "@mui/material";

const EvaluatePE = () => {
  const navigate = useNavigate();
  const { pgprId, criteriaId } = useParams();
  //const open = useDrawerState().drawerState.open;
  const [value, setValue] = useState(0);

  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [DEremarks, setDEremarks] = useState("");
  const [DEScore, setDEScore] = useState(0);
  const [prevPEremarks, setPrevPEremarks] = useState("");
  const [prevPEScore, setPrevPEScore] = useState(0);
  const [PEremarks, setPEremarks] = useState("");
  const [PEScore, setPEScore] = useState(0);
  const [observationsErrMsg, setObservationsErrMsg] = useState("");
  const [scoreErrMsg, setScoreErrMsg] = useState("");

  const [evidencesForStandard, setEvidencesForStandard] = useState([]); 
  const [pgprDetails, setPGPRDetails] = useState({});
  const [properEvaluation, setProperEvaluation] = useState("");
  const [deskEvaluation, setDeskEvaluation] = useState("");
  const [SERId, setSERId] = useState("");
  const [SER, setSER] = useState({});
  const [standardId, setStandardId] = useState(null);
  const [standards, setStandards] = useState([]);
  const [assignedCriterias, setAssignedCriterias] = useState([]);
  const [allData, setAllData] = useState({});
  const [criteriaName, setCriteriaName] = useState("");
  const [standardIdAssigned, setStandardIdAssigned] = useState(false);
  const [PEData, setPEData] = useState([]);

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "Proper Evaluation",
      link: `/PG_Assignments/Conduct_PE/${pgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`,
    },
    {
      name: "Evaluate PE",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}/${criteriaId}`,
    },
  ]);
  
  useEffect(() => {
    document.title = "Evaluate PE";
    getSERDetails(); 
  }, [standardId]);
  
  const getSERDetails = async () => {
    setLoading(true);
    // setErrorMsg("");
    try {
      const pgprResponse = await getSpecificPGPR(pgprId);
      setPGPRDetails(pgprResponse?.data?.data);
      setSERId(pgprResponse?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
      setDeskEvaluation(pgprResponse?.data?.data?.postGraduateReviewProgram?.deskEvaluation);
      setProperEvaluation(
        pgprResponse?.data?.data?.properEvaluation
      );

      const serResponse = await getSelfEvaluationReport(pgprResponse?.data?.data?.postGraduateReviewProgram?.selfEvaluationReport?.id);
      setSER(
        serResponse?.data?.data
      );

      const selectedStandards = serResponse?.data?.data?.criterias?.find((criteria) => {
        return criteria?.id == criteriaId;
      });
      setStandards(selectedStandards?.standards);
      //console.log("Selected Standards : ", selectedStandards);

      if (!standardIdAssigned) {
        // Assign the standardId to the first standard
        setStandardId(selectedStandards?.standards[0]?.id);
        // Update the flag to indicate assignment has been made
        setStandardIdAssigned(true);
      }

      const AssignCriteriaResponse = await axios.get(
        `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/display-remarks-scores?pgpr=${pgprId}&properEvaluation=${pgprResponse?.data?.data?.postGraduateReviewProgram?.properEvaluation?.id}`
      );
      setAssignedCriterias(AssignCriteriaResponse?.data);
      //console.log("Assigned Criterias : ", AssignCriteriaResponse?.data);
      setCriteriaName(AssignCriteriaResponse.data?.find((criteria) => {
        return criteria?.criteriaId == criteriaId;
      })?.criteriaName);

      if(standardId) {
        const DEResponse = await axios.get(
          `${SERVER_URL}${SERVER_API_VERSION}reviewer/desk-evaluation/display-remarks?deskEvaluation=${pgprResponse?.data?.data?.postGraduateReviewProgram?.deskEvaluation?.id}&criteria=${criteriaId}&standard=${standardId}`
        );

        setDEremarks(DEResponse?.data?.data?.comment ?? "");
        setDEScore(DEResponse?.data?.data?.score ?? 0);
        //console.log("Desk Evaluation Remarks : ", DEResponse?.data?.data);
        //return DEResponse?.data?.data;

        const PEResponse = retrievePEData(pgprResponse?.data?.data?.postGraduateReviewProgram?.properEvaluation?.id);

        //console.log("Proper Evaluation Response : ", PEResponse?.data);

        const EviResponse = await getStandardEvidencesAndAdherenceForSER(
          pgprResponse?.data?.data?.postGraduateReviewProgram
            ?.selfEvaluationReport?.id,
          standardId
        );
        setEvidencesForStandard(EviResponse?.data?.data);
        //console.log("Standard Evidences and Adherence : ",EviResponse?.data?.data);
        setAllData(
          DEResponse?.data?.data,
          PEResponse?.data,
          EviResponse?.data?.data
        );
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const retrievePEData = async(peId)=>{
      const PEResponse = await axios.get(
        `${SERVER_URL}${SERVER_API_VERSION}reviewer/proper-evaluation/display-remarks-scores?pgpr=${pgprId}&properEvaluation=${peId}`
      );

      setPEData(PEResponse?.data);
      return PEResponse;
  }
  useEffect(() => {
    const criteriaData = PEData?.find(
      (criteria) => {
        return criteria.criteriaId == criteriaId
      }
    );

    if (criteriaData) {
      const standardData = criteriaData?.evaluatedStandards?.find((standard) => {
        return standard?.standardId == standardId;
      });

      if(standardData) {
        setPrevPEremarks(standardData?.comment ?? "");
        setPrevPEScore(standardData?.peScore ?? 0);
        setPEScore(standardData?.peScore ?? 0);
        setPEremarks(standardData?.comment ?? "");
      } else {
        setPrevPEremarks("");
        setPrevPEScore(0);
        setPEScore(0);
        setPEremarks("");
      }
    }

    // setPrevPEremarks(PEResponse?.data?.comment ?? "");
    // setPrevPEScore(PEResponse?.data?.score ?? 0);
    // setPEScore(PEResponse?.data?.score ?? 0);
    // setPEremarks(PEResponse?.data?.comment ?? "");
    // console.log("Proper Evaluation Remarks : ", PEResponse?.data);
    //return PEResponse?.data?.data;
  }, [PEData]);

  //console.log("Standard ID : ", standards);

  const standardCount = standards[0]?.id + standards?.length-1;
  //console.log("Standard Count : ", standardCount)

  const handleChangeObservations = (event) => {
    let max = 500;
    let temp = event.target.value;
    if (temp.length > max) {
      setObservationsErrMsg(`maximum length is ${max}`);
    } else {
      // event.target.focus();
      // setObservationsErrMsg("");
      setPEremarks(temp);
    }
  };

  const handleChangeScore = (event) => {
    let temp = event.target.value;
    if (temp < 0) {
      setScoreErrMsg("Score shouldn't be less than zero");
      setTimeout(()=>setScoreErrMsg(""),1000);
    } else if (temp > 3) {
      setScoreErrMsg("Score shouldn't be greater than 3");
      setTimeout(()=>setScoreErrMsg(""),1000);
    } else {
      setScoreErrMsg("");
      setPEScore(parseInt(temp));
    }
  };

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePrevious = () => {
    if (PEScore !== prevPEScore || PEremarks !== prevPEremarks) {
      setErrorMsg("Please save the changes before proceeding");
      return;
    }
    // console.log("Standard ID : ", standardId);
    if (standardId > 1) {
      setValue(standardId -1 - standards[0].id);
      setStandardId(standardId - 1);
    }
  };

  // console.log("value : ", value)

  const handleNext = () => {
    if (PEScore !== prevPEScore || PEremarks !== prevPEremarks) {
      setErrorMsg("Please save the changes before proceeding");
      return;
    }
    // console.log("Standard ID : ", standardId);
    // console.log("Standard Count : ", standardCount);
    if (standardId < standardCount) {
      setValue(standardId +1 - standards[0].id);
      setStandardId(standardId + 1);
    }
  };

  const handleClickSave = () => {
    if ( PEremarks == "")
    {
      setErrorMsg("Observation must be filled");
      return;
    }
    else if(PEScore < 0 || PEScore > 3)
    {
      setErrorMsg("proper evaluation score should be a number between 1 and 3");
      return;
    }
    else if(PEremarks.length > 255) {
      setErrorMsg("Observation comment must not exceed 255 characters");
      return;
    }
    const save = async () => {
      setLoading(true);
      // setErrorMsg("");
      try {
        const formData = new FormData();
        formData.append("pgprId", pgprId);
        formData.append("criteriaId", criteriaId);
        formData.append("standardId", standardId);
        formData.append("observations", PEremarks);
        formData.append("score", PEScore);

        await axios.get("/sanctum/csrf-cookie");
        const response = await axios.post(
          `${SERVER_URL}${SERVER_API_VERSION}reviewer/conduct/proper-evaluation`,
          formData
        );
        
        setErrorMsg(response?.data?.message)
        setSuccess(true);
        retrievePEData(pgprDetails.postGraduateReviewProgram?.properEvaluation?.id);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    save();
  };

  const handleClickCancel = () => {
    if (PEScore !== prevPEScore || PEremarks !== prevPEremarks) {
      setErrorMsg("Please save the changes before proceeding");
      return;
    }
    // navigate to `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`
    navigate(`../Assigned_criteria/${pgprId}`);

  };

  const handleClickRestore = () => {
    setPEremarks(prevPEremarks);
    setPEScore(prevPEScore);
  };

  const row =
    evidencesForStandard === null
      ? []
      : {
          standardId: evidencesForStandard?.id,
          criteriaId: evidencesForStandard?.criteriaId,
          standardName: evidencesForStandard?.description,
          standardNo: evidencesForStandard?.standardNo,
          adhere:
            evidencesForStandard?.standardAdherence?.adherence,
          evidences: evidencesForStandard?.evidences ?? [],
        };

  function TabPanel (props) {
    const {
      keyId,
      row, 
      value, 
      index, 
      DEScore, 
      DEComment, 
      PEScore, 
      PEComment,
      criteria, 
      ...other 
    } = props;

    return (
      <Box
        key={keyId}
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        sx={{ width: "100%" }}
      >
        {value === index && (
          <>
            <Divider sx={{ marginY: "0.5rem" }} textAlign="center">
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                Proper Evaluation
              </Typography>
            </Divider>
            <Box sx={{ padding: "0.5rem 1rem", width: "100%" }}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Criteria : {criteria}
              </Typography>
              <TextField
                id="outlined-multiline-flexible-disabled"
                label={`Standard ${criteriaId}.${index + 1}`}
                defaultValue={row.standardName ?? "No criteria name provided"}
                multiline
                disabled
                maxRows={4}
                fullWidth
                sx={{ marginY: "1rem" }}
              />
              <TextField
                id="outlined-multiline-flexible-disabled"
                label="University Adhere to the Standard"
                multiline
                rows={4}
                fullWidth
                disabled
                value={row.adhere ?? "No adherence provided"}
                sx={{ marginY: "1rem" }}
              />

              <TableContainer component={Paper} style={{ margin: "1rem 0" }}>
                <Table
                  sx={{ minWidth: 650 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#D8E6FC",
                          paddingY: "0.5rem",
                        }}
                        align="center"
                      >
                        <b>Documentary Evidences</b>
                      </TableCell>
                      <TableCell
                        sx={{
                          backgroundColor: "#D8E6FC",
                          paddingY: "0.5rem",
                        }}
                        align="center"
                      >
                        <b>Years Applicable</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.evidences.length !== 0 ? (
                      row.evidences.map((evidence, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                            <Link
                              href={evidence["url"]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {evidence["evidenceCode"]} -{" "}
                              {evidence["evidenceName"]}
                            </Link>
                          </TableCell>
                          <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                            <Typography
                              style={{ margin: "8px 0" }}
                              variant="body2"
                              component="div"
                              sx={{ flexGrow: 1 }}
                            >
                              {evidence["applicableYears"].join(" , ")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={2}>
                          <Typography
                            style={{ margin: "8px 0" }}
                            variant="body2"
                            component="div"
                            sx={{ flexGrow: 1 }}
                          >
                            No Evidences Uploaded
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </Box>
          </>
        )}
      </Box>
    );

  }

  TabPanel.propTypes = {
    keyId: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    DEScore: PropTypes.number,
    DEComment: PropTypes.string,
    PEScore: PropTypes.number,
    PEComment: PropTypes.string,
    criteria: PropTypes.string.isRequired,
  };

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            marginTop: "-10vh",
          }}
        >
          <Typography variant="h5" color="primary">
            Loading...
          </Typography>
          <CircularProgress size={50} thickness={3} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleValueChange}
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                  maxHeight: "60vh",
                  width: "12rem",
                }}
                aria-label="Vertical tabs example"
              >
                {standards.map((standard, index) => (
                  <Tab
                    key={standard.id}
                    label={`Standard ${standard.standardNo}`}
                    id={`vertical-tab-${index}`}
                    aria-controls={`vertical-tabpanel-${index}`}
                    onClick={() => {
                      setStandardId(standard.id);
                    }}
                  />
                ))}
              </Tabs>
              {loading ? (
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
              ) : (
                standards?.map((standard, index) => (
                  //console.log("row : ", index+1),
                  <TabPanel
                    criteria={criteriaName}
                    key={index + 1}
                    keyId={index + 1}
                    row={row}
                    value={value}
                    index={index}
                    DEScore={DEScore}
                    DEComment={DEremarks}
                    PEScore={PEScore}
                    PEComment={PEremarks}
                  />
                ))
              )}
            </Box>
          </Box>
        </>
      )}

      {!loading &&
      <>
        <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item xs={5}>
            <Box
              sx={{
                border: "1px solid gray",
                borderRadius: "0.2rem",
                height: "8rem",
                overflowY: "auto",
              }}
            >
              <Box
                display="flex"
                justify="space-between"
                alignItems="center"
                backgroundColor="#D8E6FC"
                sx={{ flexGrow: 1 }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ margin: "0.25rem" }}
                >
                  Desk Evaluation Remarks
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ margin: "0.25rem", marginLeft: "4rem" }}
                  color="primary"
                >
                  DE Score: {DEScore ?? 0}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                component="div"
                sx={{ flexGrow: 1, margin: "0.5rem" }}
              >
                {DEremarks ?? "No DE Comments"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <FormControl
              {...(observationsErrMsg != "" ? { error: true } : {})}
              variant="standard"
              sx={{ width: "100% " }}
            >
              <TextField
                id="observations"
                label="observations"
                value={PEremarks?? "no"}
                onChange={(e)=>setPEremarks(e.target.value)}
                multiline
                rows={4}
              />
              <FormHelperText id="component-error-text">
                {observationsErrMsg}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <FormControl
              {...(scoreErrMsg != "" ? { error: true } : {})}
              variant="standard"
              sx={{ width: "100%" }}
            >
              <TextField
                id="scores"
                label="Score"
                value={PEScore}
                onChange={(e) => {
                  handleChangeScore(e);
                }}
                placeholder="0-3"
                type="number"
                rows={4}
              />
              <FormHelperText id="component-error-text">
                {scoreErrMsg}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          justifyContent: "space-between",
          marginY: "2rem",
          alignItems: "center",
          display: "flex",
        }}
        width="100%"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevious}
          disabled={value === 0}
        >
          Previous
        </Button>
        <Box
          sx={{
            justifyContent: "center",
            marginX: "1rem",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginX: "1rem",
            }}
            color="success"
            onClick={handleClickSave}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled = {PEremarks !== prevPEremarks || PEScore != prevPEScore}
            sx={{
              marginX: "1rem",
            }}
            onClick={handleClickCancel}
          >
            Cancel
          </Button>
          {PEremarks !== prevPEremarks || PEScore != prevPEScore ? (
            <Button
              onClick={handleClickRestore}
              variant="outlined"
              color="primary"
              sx={{ marginX: "1rem" }}
            >
              Restore
            </Button>
          ) : (
            ""
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={value === standardCount - 1}
        >
          Next
        </Button>
      </Box>
      </>
      }
      <Snackbar
        open={errorMsg !== "" && !success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setErrorMsg("")}
      >
        <Alert onClose={() => setErrorMsg("")} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => {
          setSuccess(false);
          setErrorMsg("");
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            setErrorMsg("");
          }}
          severity="success"
        >
          {errorMsg}
          {/* on success */}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EvaluatePE;
