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
import { useNavigate, useParams } from "react-router-dom";
import getStandardsForSER from "../../api/SelfEvaluationReport/getStandardsForSER";
import getStandardEvidencesAndAdherenceForSER from "../../api/SelfEvaluationReport/getStandardEvidencesAndAdherenceForSER";
import addAdherenceToStandard from "../../api/SelfEvaluationReport/addAdherenceToStandard";
import { useEffect } from "react";
import createEvidence from '../../api/Evidence/createEvidence';
import { Form } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';



const EditingSelfEvaluationReport = () => {


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

    const { auth } = useAuth();

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

    //getting the criteriaId and serId from the url
    const { criteriaId, serId, pgprId } = useParams();

    //getting the applicable standards for the given criteriaId and serId
    const [applicableStandards, setApplicableStandards] = useState([]);

    //getting the evidences and adherence for the selected standard
    const [standardEvidencesAndAdherence, setStandardEvidencesAndAdherence] = useState([]);

    const [isLoaded, setIsLoaded] = useState(false);

    const [pgprState, setPgprState] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const gettingStandards = async () => {
            try {
                const response = await getStandardsForSER(serId, criteriaId);

                if (response && response.status === 200) {
                    console.log(response.data.data);
                    setApplicableStandards(response.data.data);

                    //set selected standard as the first one
                    setSelectedStandard(response.data.data[0]);
                    setIsLoaded(true);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        gettingStandards();
    }, [criteriaId, serId]);

    useEffect(() => {
        const pgprState = async () => {
            try {
                const response = await getPGPR(pgprId);

                if (response) {
                    console.log(response.data.data);
                    setPgprState(response.data.data.statusOfPgpr);
                }
            }
            catch (error) {
                console.log(error);
            }
        }

        pgprState();
    }, [pgprId]);

    const [selectedStandard, setSelectedStandard] = useState(null);

    const getEvidencesAdherence = async () => {
        try {
            if (selectedStandard == null) {
                return;
            }
            const response = await getStandardEvidencesAndAdherenceForSER(serId, selectedStandard.id);

            if (response && response.status === 200) {
                console.log(response.data.data);
                setStandardEvidencesAndAdherence(response.data.data);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getEvidencesAdherence();
    }, [selectedStandard, serId]);



    const handleEvidenceSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('standardId', selectedStandard.id);

        const applicableYears = [];
        //add applicableYears as an array to formData
        for (let i = 1; i <= 5; i++) {
            if (formData.get(`y${i}`) === 'on') {
                applicableYears.push(i);
                console.log(i);

                formData.delete(`year${i}`);
            }
        }

        //create a json object from formData
        const evidence = {};
        formData.forEach((value, key) => {
            evidence[key] = value;
        });

        //add applicableYears to evidence
        evidence['applicableYears'] = applicableYears;
        evidence['selfEvaluationReportId'] = serId;


        if (evidence.evidenceCode === '' || evidence.evidenceName === '' || evidence.url === '' || evidence.applicableYears.length === 0) {
            alert('Please fill all the fields');
            return;
        }

        try {
            const resultRes = await createEvidence(evidence);

            if (resultRes && resultRes.status === 201) {
                console.log(resultRes);
                alert('Evidence added successfully');
                getEvidencesAdherence();
                setOpenAdd(false);
            }
        }
        catch (error) {
            console.log(error);
        }
    }


    //save adherence
    const handleSaveAdherence = async (e) => {
        e.preventDefault();

        if (selectedStandard == null) {
            alert('Please select a standard');
            return;
        }

        if (standardEvidencesAndAdherence.standardAdherence === '' || standardEvidencesAndAdherence.standardAdherence === null) {
            alert('Please fill the adherence field');
            return;
        }
        const request = {};
        request.adherence = standardEvidencesAndAdherence.standardAdherence;
        request.standardId = selectedStandard.id;

        console.log(request);

        try {
            const response = await addAdherenceToStandard(serId, request);

            if (response && response.status === 201) {
                alert('Adherence added successfully');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const { y1, y2, y3, y4, y5 } = addCheckState;

    const handleCheckChange = (event) => {
        setAddCheckState({
            ...addCheckState,
            [event.target.name]: event.target.checked,
        });
    };

    const handleValueChange = (event, newValue) => {
        //new value index in the applicable standards
        setSelectedStandard(applicableStandards[newValue]);
        setStandardEvidencesAndAdherence(null);
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
        setSelectedStandard(applicableStandards[applicableStandards.findIndex(standard => standard.id === selectedStandard.id) - 1]);
        setStandardEvidencesAndAdherence(null);
    };

    const handleNext = () => {
        setSelectedStandard(applicableStandards[applicableStandards.findIndex(standard => standard.id === selectedStandard.id) + 1]);
        setStandardEvidencesAndAdherence(null);
    };

    const setTabValue = () => {
        const val = applicableStandards.findIndex((standard) => selectedStandard.id === standard.id);
        return val;
    }

    return (
        isLoaded &&
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={setTabValue()}
                    onChange={handleValueChange}
                    sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        maxHeight: "80vh",
                        width: "12rem",
                    }}
                    aria-label="Vertical tabs example"
                >
                    {applicableStandards?.map((standard, index) => (
                        <Tab
                            key={standard.id + standard.standardNo}
                            label={'Standard ' + standard.standardNo}
                            id={`vertical-tab-${index}`}
                            value={index}
                            aria-controls={`vertical-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
                {applicableStandards?.map((standard, index) => (
                    <Box
                        key={standard.id + standard.standardNo + 'data'}
                        role="tabpanel"
                        hidden={selectedStandard !== null && selectedStandard.id !== standard.id}
                        id={`vertical-tabpanel-${index}`}
                        aria-labelledby={`vertical-tab-${index}`}
                        sx={{ width: "100%" }}
                    >
                        {selectedStandard !== null && selectedStandard.id === standard.id && (
                            <>
                                <Divider textAlign="center">
                                    <Chip label="Edit Self Evaluation Report" />
                                </Divider>
                                <Box sx={{ padding: "2rem", width: "100%" }}>
                                    <TextField
                                        id="outlined-multiline-flexible-disabled"
                                        label={`Standard ${selectedStandard.standardNo}`}
                                        defaultValue={selectedStandard.description}
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
                                        value={standardEvidencesAndAdherence?.standardAdherence?.adherence}
                                        onChange={(e) => setStandardEvidencesAndAdherence({
                                            ...standardEvidencesAndAdherence,
                                            standardAdherence: e.target.value
                                        })}
                                        sx={{ marginY: "1rem" }}
                                        focused={standardEvidencesAndAdherence?.standardAdherence !== null}
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
                                        {standardEvidencesAndAdherence?.evidences?.length !== 0 ? (
                                            standardEvidencesAndAdherence?.evidences?.map((evidence) => (
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
                                                    {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' &&
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
                                                                <DialogTitle align='center'>
                                                                    {selectedStandard.description}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText
                                                                        sx={{ color: "blue", textAlign: "center" }}
                                                                    >
                                                                        Update Evidence
                                                                    </DialogContentText>
                                                                    <form
                                                                        onSubmit={handleEvidenceSubmit}
                                                                    >
                                                                        <TextField
                                                                            autoFocus
                                                                            margin="normal"
                                                                            id="standardNo"
                                                                            label="Standard No"
                                                                            type="text"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            value={`${selectedStandard.standardNo}`}
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
                                                                                        ].includes(1) || y1}
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
                                                                                        ].includes(2) || y2}
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
                                                                                        ].includes(3) || y3}
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
                                                                                        ].includes(4) || y4}
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
                                                                                        ].includes(5) || y5}
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
                                                                    </form>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button onClick={handleCloseUpdate}>Cancel</Button>
                                                                    <Button onClick={handleCloseUpdate} type='submit'>Update</Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </Grid>

                                                    }
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
                                        {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' &&
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
                                        }
                                        <Dialog open={openAdd} onClose={handleCloseAdd}>
                                            <DialogTitle align='center'>
                                                {selectedStandard.description}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText
                                                    sx={{ color: "blue", textAlign: "center" }}
                                                >
                                                    Add New Evidence
                                                </DialogContentText>
                                                <form
                                                    onSubmit={handleEvidenceSubmit}
                                                >
                                                    <TextField
                                                        autoFocus
                                                        margin="normal"
                                                        id="standardNo"
                                                        label="Standard No"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                        value={`${selectedStandard.standardNo}`}
                                                        disabled
                                                    />
                                                    <TextField
                                                        autoFocus
                                                        margin="normal"
                                                        id="evidenceCode"
                                                        label="Evidence Code"
                                                        type="text"
                                                        fullWidth
                                                        name="evidenceCode"
                                                        variant="outlined"
                                                    />
                                                    <TextField
                                                        autoFocus
                                                        margin="normal"
                                                        id="evidenceName"
                                                        label="Evidence Name"
                                                        type="text"
                                                        fullWidth
                                                        name="evidenceName"
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
                                                        name='url'
                                                        label="Evidence URL"
                                                        type="text"
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                    <DialogActions>
                                                        <Button type='submit'>Add</Button>
                                                        <Button onClick={handleCloseAdd}>Cancel</Button>
                                                    </DialogActions>
                                                </form>
                                            </DialogContent>
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
                                            disabled={selectedStandard.id === applicableStandards[applicableStandards.length - 1].id}
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
                                                onClick={handleSaveAdherence}
                                            >
                                                Save Current Adherence
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    marginX: "1rem",
                                                }}
                                            >
                                                Clear Current Adherence
                                            </Button>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                            disabled={selectedStandard.id === applicableStandards[applicableStandards.length - 1].id}
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
                                            onClick={() => navigate(-1)}
                                        >
                                            Go Back
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

export default EditingSelfEvaluationReport;
