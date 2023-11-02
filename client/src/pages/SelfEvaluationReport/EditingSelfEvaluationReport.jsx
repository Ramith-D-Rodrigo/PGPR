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
    FormControl,
    Snackbar,
    Alert
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

import deleteEvidence from '../../api/Evidence/deleteEvidence';
import updateEvidenceApi from '../../api/Evidence/updateEvidence';
import getPGPRDEScores from "../../api/PostGraduateProgramReview/getPGPRDEScores";



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
            name: "Postgraduate Programme Reviews",
            link: "/pgprs",
        },
        {
            name: "Edit Self Evaluation Report",
            link: window.location.pathname,
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
    
    const [pgprDEScores, setPgprDEScores] = useState(null);

    const [pgprPEScores, setPgprPEScores] = useState(null);

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

        const pgprDEScores = async () => {
            try{
                const response = await getPGPRDEScores(pgprId);

            }
            catch(error){
                console.log(error);
            }
        }


        const pgprPEScores = async ()=> {
            try {
                const response = await getPGPRPEScores(pgprId);
            }
            catch(error){
                console.log(error);
            }
        }

        pgprState();

        if(pgprState === 'PE1' || pgprState === 'PE2'){
            pgprDEScores();
        }

        if(pgprState === 'FINAL' || pgprState === 'COMPLETED'){
            pgprPEScores();
        }


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
            setSnackbar({
                open: true,
                message: 'Please fill all the fields',
                severity: 'error',
                autoHideDuration: 10000
            });

            return;
        }

        try {
            setSnackbar({
                open: true,
                message: 'Adding evidence...',
                severity: 'info',
                autoHideDuration: null
            });

            const resultRes = await createEvidence(evidence);

            if (resultRes && resultRes.status === 201) {
                console.log(resultRes);

                setSnackbar({
                    open: true,
                    message: 'Evidence added successfully',
                    severity: 'success',
                    autoHideDuration: 6000
                });

                getEvidencesAdherence();
                setOpenAdd(false);
            }
        }
        catch (error) {
            setSnackbar({
                open: true,
                message: error.response.data.message,
                severity: 'error',
                autoHideDuration: 10000
            });
        }
    }

    const handleUpdateEvidence = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const applicableYears = [];
        //add applicableYears as an array to formData
        for (let i = 1; i <= 5; i++) {
            if (formData.get(`y${i}`) === 'on') {
                applicableYears.push(i);
                console.log(i);

                formData.delete(`y${i}`);
            }
        }

        //create a json object from formData
        const evidence = {};
        formData.forEach((value, key) => {
            evidence[key] = value;
        });

        //add applicableYears to evidence
        evidence['applicableYears'] = applicableYears;

        if (evidence.evidenceCode === '' || evidence.evidenceName === '' || evidence.url === '' || evidence.applicableYears.length === 0) {
            setSnackbar({
                open: true,
                message: 'Please fill all the fields',
                severity: 'error',
                autoHideDuration: 10000
            });

            return;
        }

        console.log(evidence);

        try {
            setSnackbar({
                open: true,
                message: 'Updating evidence...',
                severity: 'info',
                autoHideDuration: null
            });

            const resultRes = await updateEvidenceApi(evidence, updateEvidence.id);

            if (resultRes && resultRes.status === 200) {
                console.log(resultRes);

                setSnackbar({
                    open: true,
                    message: 'Evidence updated successfully',
                    severity: 'success',
                    autoHideDuration: 6000
                });

                getEvidencesAdherence();
                setOpenUpdate(false);
            }

        }
        catch (error) {
            setSnackbar({
                open: true,
                message: error.response.data.message,
                severity: 'error',
                autoHideDuration: 10000
            });

        }
    }

    //save adherence
    const handleSaveAdherence = async (e) => {
        e.preventDefault();

        if (selectedStandard == null) {
            setSnackbar({
                open: true,
                message: 'Please select a standard',
                severity: 'error',
                autoHideDuration: 10000
            });

            return;
        }

        if (standardEvidencesAndAdherence.standardAdherence === null || standardEvidencesAndAdherence.standardAdherence?.adherence === '') {
            setSnackbar({
                open: true,
                message: 'Please fill the adherence',
                severity: 'error',
                autoHideDuration: 10000
            });

            return;
        }
        const request = {};
        request.adherence = standardEvidencesAndAdherence.standardAdherence.adherence;
        request.standardId = selectedStandard.id;

        console.log(request);

        try {
            setSnackbar({
                open: true,
                message: 'Saving adherence...',
                severity: 'info',
                autoHideDuration: null
            });

            const response = await addAdherenceToStandard(serId, request);

            if (response && response.status === 201) {
                setSnackbar({
                    open: true,
                    message: 'Adherence saved successfully',
                    severity: 'success',
                    autoHideDuration: 6000
                });
            }
        }
        catch (error) {
            console.log(error);

            setSnackbar({
                open: true,
                message: 'Error saving adherence',
                severity: 'error',
                autoHideDuration: 10000
            });
        }
    }

    const { y1, y2, y3, y4, y5 } = addCheckState;

    const handleCheckChange = (event) => {
        //if the event is unchecking a checkbox, remove that year from the array
        if (event.target.checked === false) {
            console.log(updateEvidence.applicableYears);
            const index = updateEvidence.applicableYears.indexOf(parseInt(event.target.name[1]));
            console.log(index);
            if (index > -1) {
                setUpdateEvidence({
                    ...updateEvidence,
                    applicableYears: updateEvidence.applicableYears.filter(year => year !== parseInt(event.target.name[1]))
                });

            }

            //set the checkbox state
            setAddCheckState({ ...addCheckState, [event.target.name]: event.target.checked });
        }
        else {
            setUpdateEvidence({
                ...updateEvidence,
                applicableYears: [...updateEvidence.applicableYears, parseInt(event.target.name[1])]
            });

            //set the checkbox state
            setAddCheckState({ ...addCheckState, [event.target.name]: event.target.checked });
        }
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

    const handleEvidenceDelete = async () => {
        const evidenceId = updateEvidence.id;

        try {
            setSnackbar({
                open: true,
                message: 'Deleting evidence...',
                severity: 'info',
                autoHideDuration: null
            });

            const response = await deleteEvidence(evidenceId);

            if (response && response.status === 200) {
                setSnackbar({
                    open: true,
                    message: 'Evidence deleted successfully',
                    severity: 'success',
                    autoHideDuration: 6000
                });

                getEvidencesAdherence();
                setOpenUpdate(false);
            }

        }
        catch (error) {
            console.log(error);

            setSnackbar({
                open: true,
                message: 'Error deleting evidence',
                severity: 'error',
                autoHideDuration: 10000
            });
        }
    }

    const handleClearAdherence = () => {
        //only clear the adherence, not saving it
        setStandardEvidencesAndAdherence({
            ...standardEvidencesAndAdherence,
            standardAdherence: {
                ...standardEvidencesAndAdherence.standardAdherence,
                adherence: ''
            }
        });

        console.log(standardEvidencesAndAdherence);
    }

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error',
        autoHideDuration: 6000,
    });



    return (
        isLoaded &&
        <>
            <Snackbar open={snackbar.open} autoHideDuration={snackbar.autoHideDuration} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

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
                                            label={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? "University Adhere to the Standard" : ''}
                                            multiline
                                            rows={4}
                                            fullWidth
                                            value={standardEvidencesAndAdherence?.standardAdherence?.adherence}
                                            onChange={(e) => {
                                                console.log(standardEvidencesAndAdherence);
                                                setStandardEvidencesAndAdherence({
                                                    ...standardEvidencesAndAdherence,
                                                    standardAdherence: {
                                                        ...standardEvidencesAndAdherence.standardAdherence,
                                                        adherence: e.target.value
                                                    }
                                                });
                                            }}
                                            sx={{ marginY: "1rem" }}
                                            focused={standardEvidencesAndAdherence?.standardAdherence !== null}
                                            helperText="This is the adherence of the university to the standard"
                                            disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
                                        />
                                        {
                                            (pgprState === 'PE1' || pgprState === 'PE2' || pgprState === 'FINAL' || pgprState === 'COMPLETED') ?
                                                <>
                                                    <Divider sx={{ marginY: '1rem' }} textAlign="left">
                                                        <Chip label="Evaluation Scores Given by the Review Team" />
                                                    </Divider>
                                                    <Box sx={{
                                                        position: "relative",
                                                        height: "10rem",
                                                        border: "1px solid grey",
                                                        borderRadius: "0.3rem",
                                                        marginY: "1rem",
                                                        overflowY: "scroll",
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                    }}
                                                        fullWidth>
                                                        <Box sx={{
                                                            width: '50%',
                                                            margin: '1rem',
                                                            textAlign: 'center'
                                                        }}>
                                                            Desk Evaluation Score
                                                            <Box sx={{
                                                                fontSize: '2rem',
                                                                margin: '1rem'
                                                            }}>
                                                                Score
                                                            </Box>
                                                        </Box>

                                                        <Box sx={{
                                                            width: '50%',
                                                            margin: '1rem',
                                                            textAlign: 'center'
                                                        }}>
                                                            Proper Evaluation Score
                                                            <Box sx={{
                                                                fontSize: '2rem',
                                                                margin: '1rem'
                                                            }}>
                                                                Score
                                                            </Box>
                                                        </Box>

                                                    </Box>
                                                </>
                                                :
                                                <></>

                                        }
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

                                                        <Grid item>
                                                            <Button
                                                                variant="contained"
                                                                color="info"
                                                                size="small"
                                                                onClick={() => handleClickOpenUpdate(evidence)}
                                                                disabled={snackbar.open}
                                                            >
                                                                {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? 'Update' : 'View'}
                                                            </Button>
                                                            <Dialog open={openUpdate} onClose={handleCloseUpdate}>
                                                                <DialogTitle align='center'>
                                                                    {selectedStandard.description}
                                                                </DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText
                                                                        sx={{ color: "blue", textAlign: "center" }}
                                                                    >
                                                                        {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? 'Update Evidence' : 'Viewing Evidence'}
                                                                    </DialogContentText>
                                                                    <form
                                                                        onSubmit={handleUpdateEvidence}
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
                                                                            onChange={(e) => {
                                                                                setUpdateEvidence({
                                                                                    ...updateEvidence,
                                                                                    evidenceCode: e.target.value,
                                                                                });
                                                                            }}
                                                                            name="evidenceCode"
                                                                            disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
                                                                        />
                                                                        <TextField
                                                                            autoFocus
                                                                            margin="normal"
                                                                            id="evidenceName"
                                                                            label="Evidence Name"
                                                                            type="text"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            name="evidenceName"
                                                                            value={updateEvidence["evidenceName"]}
                                                                            onChange={(e) => {
                                                                                setUpdateEvidence({
                                                                                    ...updateEvidence,
                                                                                    evidenceName: e.target.value,
                                                                                });
                                                                            }}

                                                                            disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                                        disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                                        disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                                        disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                                        disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                                        disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
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
                                                                            name="url"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            onChange={(e) => {
                                                                                setUpdateEvidence({
                                                                                    ...updateEvidence,
                                                                                    url: e.target.value,
                                                                                });
                                                                            }}
                                                                            value={updateEvidence["url"]}
                                                                            disabled={(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ? false : true}
                                                                        />
                                                                        <DialogActions>
                                                                            {/*delete evidence*/}
                                                                            <Box sx={{ position: 'absolute', left: '1rem' }}>
                                                                                {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' &&
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        color="error"
                                                                                        size="small"
                                                                                        onClick={handleEvidenceDelete}
                                                                                        disabled={snackbar.open}

                                                                                    >
                                                                                        Delete
                                                                                    </Button>
                                                                                }
                                                                            </Box>
                                                                            {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' ?
                                                                                (
                                                                                    <>
                                                                                        <Button onClick={handleCloseUpdate} disabled={snackbar.open}>Cancel</Button>
                                                                                        <Button type='submit' disabled={snackbar.open}>Update</Button>
                                                                                    </>
                                                                                )
                                                                                :
                                                                                (
                                                                                    <>
                                                                                        <Button onClick={handleCloseUpdate} disabled={snackbar.open}>Close</Button>
                                                                                    </>
                                                                                )
                                                                            }

                                                                        </DialogActions>
                                                                    </form>
                                                                </DialogContent>
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
                                                            <Button type='submit' disabled={snackbar.open}>Add</Button>
                                                            <Button onClick={handleCloseAdd} disabled={snackbar.open}>Cancel</Button>
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
                                            {(auth.authRole[0] === 'programme_coordinator' || auth.authRole[0] === 'iqau_director') && pgprState == 'PLANNING' &&
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
                                                        disabled={snackbar.open}
                                                    >
                                                        Save Current Adherence
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        sx={{
                                                            marginX: "1rem",
                                                        }}
                                                        onClick={handleClearAdherence}
                                                        disabled={snackbar.open}
                                                    >
                                                        Clear Current Adherence
                                                    </Button>
                                                </Box>
                                            }
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
                                                disabled={snackbar.open}
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
        </>
    );
};

export default EditingSelfEvaluationReport;
