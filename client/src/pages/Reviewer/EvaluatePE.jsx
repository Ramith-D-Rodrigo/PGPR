import { useEffect, useState } from "react";
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
} from "@mui/material";

//import useDrawerState from "../../hooks/useDrawerState";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";

const EvaluatePE = () => {
  const { pgprId, criteriaId } = useParams();
  //const open = useDrawerState().drawerState.open;
  const [standardID, setstandardID] = useState(1);
  const [observations, setobservations] = useState("");
  const [score, setscore] = useState(0);
  const [observationsErrMsg, setobservationsErrMsg] = useState("");
  const [scoreErrMsg, setscoreErrMsg] = useState("");

  const [value, setValue] = useState(0);
  
  useEffect(() => {
    //get all initial (1)standard details/ data from endpoint
  }, []);

  useEffect(() => {
    //get standard details/ data from endpoint
  }, [standardID]);

  const handleChangeObservations = (event) => {
    let max = 500;
    let value = event.target.value;
    if (value.length > max) {
      setobservationsErrMsg(`maximum length is ${max}`);
    } else {
      setobservationsErrMsg("");
      setobservations(value);
    }
  };

  const handleChangeScore = (event) => {
    let value = event.target.value;
    if (value < 0) {
      setscoreErrMsg("Score shouldn't be less than zero");
    } else if (value > 3) {
      setscoreErrMsg("Score shouldn't be greater than 4");
    } else {
      setscoreErrMsg("");
      setscore(value);
    }
  };

  const decodedPgprId = decodeURIComponent(pgprId);
  const decodedCriteriaId = decodeURIComponent(criteriaId);

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
    },
    {
      name: "Assigned Criteria",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${decodedPgprId}`,
    },
    {
      name: "Evaluate PE",
      link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${decodedPgprId}/${decodedCriteriaId}`,
    },
  ]);

  const criteriaNo = 1;
  const standardCount = 22;
  const standardLabels = Array.from(
    { length: standardCount },
    (_, index) => `Standard ${criteriaNo}.${index + 1}`
  );

  const standardData = [
    {
      standardName: "Quality Management Standard for Manufacturing Processes",
      universityAdhere: "University A",
      evidences: [
        {
          evidenceCode: "QM-001",
          evidenceName: "Quality Control Report",
          applicableYears: ["y1", "y2", "y3"],
          url: "https://example.com/evidence/qm-001",
        },
        {
          evidenceCode: "QM-002",
          evidenceName: "Production Audit Records",
          applicableYears: ["y1", "y2", "y3"],
          url: "https://example.com/evidence/qm-002",
        },
        {
          evidenceCode: "QM-003",
          evidenceName: "Security Policy Document",
          applicableYears: ["y4", "y5"],
          url: "https://example.com/evidence/qm-003",
        },
      ],
    },
    {
      standardName: "Information Security Best Practices",
      universityAdhere: "",
      evidences: [
        {
          evidenceCode: "IS-001",
          evidenceName: "Security Policy Document",
          applicableYears: ["y4", "y5"],
          url: "https://example.com/evidence/is-001",
        },
        {
          evidenceCode: "IS-002",
          evidenceName: "Incident Response Plan",
          applicableYears: ["y4", "y5"],
          url: "https://example.com/evidence/is-002",
        },
      ],
    },
    {
      standardName: "Environmental Sustainability Guidelines",
      universityAdhere: "University B",
      evidences: [],
    },
    {
      standardName: "Occupational Safety and Health Regulations",
      universityAdhere: "University C",
      evidences: [],
    },
    {
      standardName: "International Financial Reporting Standards",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Building Code for High-Rise Structures",
      universityAdhere: "University D",
      evidences: [],
    },
    {
      standardName: "Healthcare Data Privacy Standards",
      universityAdhere: "University E",
      evidences: [],
    },
    {
      standardName: "Automotive Safety Requirements",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Food Safety and Hygiene Guidelines",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Telecommunications Network Standards",
      universityAdhere: "University F",
      evidences: [],
    },
    {
      standardName: "Aviation Safety Procedures",
      universityAdhere: "University G",
      evidences: [],
    },
    {
      standardName: "International Trade Compliance Rules",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Electrical Wiring Code for Residential Buildings",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Medical Device Quality Standards",
      universityAdhere: "University H",
      evidences: [],
    },
    {
      standardName: "Software Development Best Practices",
      universityAdhere: "University I",
      evidences: [],
    },
    {
      standardName: "Energy Efficiency Standards for Appliances",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Chemical Handling Safety Guidelines",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Educational Curriculum Standards",
      universityAdhere: "University J",
      evidences: [],
    },
    {
      standardName: "Construction Materials Testing Procedures",
      universityAdhere: "University K",
      evidences: [],
    },
    {
      standardName: "Transportation Infrastructure Specifications",
      universityAdhere: "University L",
      evidences: [],
    },
    {
      standardName: "Environmental Impact Assessment Guidelines",
      universityAdhere: "",
      evidences: [],
    },
    {
      standardName: "Internet Security Protocols",
      universityAdhere: "",
      evidences: [],
    },
  ];

  const handleValueChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePrevious = () => {
    setValue((value) => value - 1);
  };

  const handleNext = () => {
    setValue((value) => value + 1);
  };

  return (
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
              maxHeight: "80vh",
              width: "12rem",
            }}
            aria-label="Vertical tabs example"
          >
            {standardLabels.map((label, index) => (
              <Tab
                key={label}
                label={label}
                id={`vertical-tab-${index}`}
                aria-controls={`vertical-tabpanel-${index}`}
              />
            ))}
          </Tabs>
          {standardLabels.map((label, index) => (
            <Box
              key={label}
              role="tabpanel"
              hidden={value !== index}
              id={`vertical-tabpanel-${index}`}
              aria-labelledby={`vertical-tab-${index}`}
              sx={{ width: "100%" }}
            >
              {value === index && (
                <>
                  <Divider sx={{ marginY: "0.5rem" }} textAlign="center">
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      Proper Evaluation
                    </Typography>
                  </Divider>
                  <Box sx={{ padding: "0.5rem 1rem", width: "100%" }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      Criteria : {criteriaId} - {pgprId}
                    </Typography>
                    <TextField
                      id="outlined-multiline-flexible-disabled"
                      label={`Standard ${criteriaNo}.${index + 1}`}
                      defaultValue={standardData[index]["standardName"]}
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
                      value={standardData[index]["universityAdhere"]}
                      sx={{ marginY: "1rem" }}
                    />

                    <TableContainer
                      component={Paper}
                      style={{ margin: "1rem 0" }}
                    >
                      <Table
                        sx={{ minWidth: 650 }}
                        stickyHeader
                        aria-label="sticky table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ backgroundColor: "#D8E6FC", paddingY: "0.5rem" }}
                              align="center"
                            >
                              <b>Documentary Evidences</b>
                            </TableCell>
                            <TableCell
                              sx={{ backgroundColor: "#D8E6FC", paddingY: "0.5rem" }}
                              align="center"
                            >
                              <b>Years Applicable</b>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {standardData[index]["evidences"].length !== 0 ? (
                            standardData[index]["evidences"].map(
                              (evidence, index) => (
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
                              )
                            )
                          ) : (
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
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={3}
                      >
                        <Grid item xs={5}>
                          <Box sx={{ border: "1px solid gray", borderRadius: "0.2rem", padding: "0.5rem", height:"8rem", overflowY: "auto"}}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ flexGrow: 1 }}
                            >
                              Desk Evaluation Remarks
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ flexGrow: 1, marginTop: "0.5rem" }}
                            >
                              Lorem ipsum dolor sit amet, consectetur adipiscing
                              elit. Donec mattis pretium massa. Aliquam erat
                              volutpat. Nulla facilisi. Donec vulputate
                              interdum sollicitudin. Nunc lacinia auctor quam
                              sed pellentesque. Aliquam dui mauris, mattis quis
                              lacus id, pellentesque lobortis odio.
                            </Typography>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ flexGrow: 1, marginTop: "0.5rem" }}
                            >
                              Score: 2
                            </Typography> 
                          </Box>
                        </Grid>
                        <Grid item xs={5}>
                          <FormControl
                            {...(observationsErrMsg != ""
                              ? { error: true }
                              : {})}
                            variant="standard"
                            sx={{ width: "100% " }}
                          >
                            <TextField
                              id="observations"
                              label="Observations"
                              value={observations}
                              onChange={(e) => {
                                handleChangeObservations(e);
                              }}
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
                              id="observations"
                              label="Score"
                              value={score}
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
                      fullWidth
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
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{
                            marginX: "1rem",
                          }}
                        >
                          Cancel
                        </Button>
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
                  </Box>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default EvaluatePE;
