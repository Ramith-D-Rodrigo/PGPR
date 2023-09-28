import {
  Box,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Chip,
  Fab,
  Typography,
  Link,
  Grid,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import { useState } from "react";

const IQAUEditSer = () => {
  const [value, setValue] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [addCheckState, setAddCheckState] = useState({
    y1: false,
    y2: false,
    y3: false,
    y4: false,
    y5: false,
  });
  const [updateEvidence, setUpdateEvidence] = useState({
    evidenceCode: "",
    evidenceName: "",
    applicableYears: [],
    url: "",
  });

  useSetUserNavigations([
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "PG Programs",
      link: "/pgPrograms",
    },
    {
      name: "View SER",
      link: "/ser",
    },
    {
      name: "Edit SER",
      link: "/editSer",
    }
  ]);

  const { y1, y2, y3, y4, y5 } = addCheckState;

  const handleCheckChange = (event) => {
    setAddCheckState({
      ...addCheckState,
      [event.target.name]: event.target.checked,
    });
  };

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

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickOpenUpdate = (evidence) => {
    setUpdateEvidence(evidence);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handlePrevious = () => {
    setValue((value) => value - 1);
  };

  const handleNext = () => {
    setValue((value) => value + 1);
  };

  return (
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
                <Divider textAlign="center">
                  <Chip label="Edit Self Evaluation Report" />
                </Divider>
                <Box sx={{ padding: "2rem", width: "100%" }}>
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
                  <Divider sx={{ marginY: "1rem" }} textAlign="left">
                    <Chip label="Documentary Evidences" />{" "}
                  </Divider>
                  <Box
                    sx={{
                      position: "relative",
                      height: "10rem",
                      border: "1px solid grey",
                      borderRadius: "0.3rem",
                      marginY: "1rem",
                      overflowY: "scroll",
                    }}
                    fullWidth
                  >
                    {standardData[index]["evidences"].length !== 0 ? (
                      standardData[index]["evidences"].map((evidence) => (
                        <Grid
                          container
                          key={evidence["evidenceCode"]}
                          sx={{
                            padding: "0.5rem",
                          }}
                          spacing={2}
                        >
                          <Grid item>
                            <Link
                              href={evidence["url"]}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ textDecoration: "none" }}
                            >
                              {evidence["evidenceCode"]} -{" "}
                              {evidence["evidenceName"]}
                            </Link>
                          </Grid>
                          <Grid item>
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => handleClickOpenUpdate(evidence)}
                            >
                              Update
                            </Button>
                            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                              <DialogTitle>
                                {standardData[index]["standardName"]}
                              </DialogTitle>
                              <DialogContent>
                                <DialogContentText
                                  sx={{ color: "blue", textAlign: "center" }}
                                >
                                  Update evidence
                                </DialogContentText>
                                <FormControl
                                  component="fieldset"
                                  variant="outlined"
                                  fullWidth
                                >
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    id="standardId"
                                    label="Standard ID"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={`${index + 1}/${standardCount}`}
                                    disabled
                                  />
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    id="evidenceCode"
                                    label="Evidence Code"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={updateEvidence["evidenceCode"]}
                                  />
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    id="evidenceName"
                                    label="Evidence Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={updateEvidence["evidenceName"]}
                                  />
                                  <FormHelperText>
                                    Years Applicable
                                  </FormHelperText>
                                  <FormGroup row>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={updateEvidence[
                                            "applicableYears"
                                          ].includes("y1") || y1}
                                          onChange={handleCheckChange}
                                          name="y1"
                                        />
                                      }
                                      label="Y1"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={updateEvidence[
                                            "applicableYears"
                                          ].includes("y2") || y2}
                                          onChange={handleCheckChange}
                                          name="y2"
                                        />
                                      }
                                      label="Y2"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={updateEvidence[
                                            "applicableYears"
                                          ].includes("y3") || y3}
                                          onChange={handleCheckChange}
                                          name="y3"
                                        />
                                      }
                                      label="Y3"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={updateEvidence[
                                            "applicableYears"
                                          ].includes("y4") || y4}
                                          onChange={handleCheckChange}
                                          name="y4"
                                        />
                                      }
                                      label="Y4"
                                    />
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={updateEvidence[
                                            "applicableYears"
                                          ].includes("y5") || y5}
                                          onChange={handleCheckChange}
                                          name="y5"
                                        />
                                      }
                                      label="Y5"
                                    />
                                  </FormGroup>
                                  <TextField
                                    autoFocus
                                    margin="normal"
                                    id="url"
                                    label="Evidence URL"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={updateEvidence["url"]}
                                  />
                                </FormControl>
                              </DialogContent>
                              <DialogActions>
                                <Button onClick={handleCloseUpdate}>Cancel</Button>
                                <Button onClick={handleCloseUpdate}>Add</Button>
                              </DialogActions>
                            </Dialog>
                          </Grid>
                        </Grid>
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "60%",
                        }}
                        fullWidth
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ color: "gray" }}
                        >
                          No Evidences Uploaded
                        </Typography>
                      </Box>
                    )}
                    <Fab
                      label="Add"
                      color="primary"
                      sx={{
                        float: "right",
                        position: "sticky",
                        bottom: "1rem",
                        right: "1rem",
                        zIndex: 1,
                      }}
                      onClick={handleClickOpenAdd}
                    >
                      <AddIcon />
                    </Fab>
                    <Dialog open={openAdd} onClose={handleCloseAdd}>
                      <DialogTitle>
                        {standardData[index]["standardName"]}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText
                          sx={{ color: "blue", textAlign: "center" }}
                        >
                          Add new evidence
                        </DialogContentText>
                        <FormControl
                          component="fieldset"
                          variant="outlined"
                          fullWidth
                        >
                          <TextField
                            autoFocus
                            margin="normal"
                            id="standardId"
                            label="Standard ID"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={`${index + 1}/${standardCount}`}
                            disabled
                          />
                          <TextField
                            autoFocus
                            margin="normal"
                            id="evidenceCode"
                            label="Evidence Code"
                            type="text"
                            fullWidth
                            variant="outlined"
                          />
                          <TextField
                            autoFocus
                            margin="normal"
                            id="evidenceName"
                            label="Evidence Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                          />
                          <FormHelperText>Years Applicable</FormHelperText>
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y1}
                                  onChange={handleCheckChange}
                                  name="y1"
                                />
                              }
                              label="Y1"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y2}
                                  onChange={handleCheckChange}
                                  name="y2"
                                />
                              }
                              label="Y2"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y3}
                                  onChange={handleCheckChange}
                                  name="y3"
                                />
                              }
                              label="Y3"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y4}
                                  onChange={handleCheckChange}
                                  name="y4"
                                />
                              }
                              label="Y4"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={y5}
                                  onChange={handleCheckChange}
                                  name="y5"
                                />
                              }
                              label="Y5"
                            />
                          </FormGroup>
                          <TextField
                            autoFocus
                            margin="normal"
                            id="url"
                            label="Evidence URL"
                            type="text"
                            fullWidth
                            variant="outlined"
                          />
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseAdd}>Cancel</Button>
                        <Button onClick={handleCloseAdd}>Add</Button>
                      </DialogActions>
                    </Dialog>
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
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    fullWidth
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                    >
                      Go to the Application
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default IQAUEditSer;
