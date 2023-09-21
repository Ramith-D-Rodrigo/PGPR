import { Link } from "react-router-dom";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import {
    Grid,
    Typography,
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
    Button
} from "@mui/material";

import { useParams } from "react-router-dom";
import useDrawerState from "../../hooks/useDrawerState";
import { useEffect, useState } from "react";
import  getSelfEvaluationReport  from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Modal from '@mui/material/Modal';



const SelfEvaluationReport = () => {

    const { serId, pgprId } = useParams();

    const open = useDrawerState().drawerState.open;

    const [ser, setSer] = useState({});

    const [isLoaded, setIsLoaded] = useState(false);

    const [headerInfo, setHeaderInfo] = useState([]);

    const {auth} = useAuth();

    useEffect(() => {
        const getPGPRData = async () => {
            try {
                const response = await getSelfEvaluationReport(serId);
                if (response && response.status === 200) {
                    setSer(response.data.data);
                    const ser = response.data.data;
                    console.log(response.data.data);

                    setHeaderInfo(
                        [
                            { label: "University:", value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.university.name },
                            {
                                label: "Faculty/Institute:",
                                value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.name,
                            },
                            { label: "PGPR ID:", value: "PGPR-" + ser.postGraduateProgramReview.id },
                            { label: "PGPR Name:", value: ser.postGraduateProgramReview.postGraduateProgramme.title },
                            { label: "Application Start Date:", value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.applicationDate },
                            { label: "Requested Date:", value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.requestDate },
                            {
                                label: "Program Coordinator:", value:
                                    ser.programmeCoordinator.academicStaff.universitySide.user.surname
                                    + " " +
                                    ser.programmeCoordinator.academicStaff.universitySide.user.initials
                            },
                        ]);

                    setIsLoaded(true);
                }

            } catch (error) {
                console.log(error);
            }
        }
        getPGPRData();

    }, [serId]);

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
    ]);

    const columns = [
        {
            column: "criteria",
            label: "Criteria",
            colspan: 1,
        },
        {
            column: "submitted_standards",
            label: "Submitted Standards",
            colspan: 1,
        },
        {
            column: "evidences",
            label: "Evidences",
            colspan: 5,
        },
    ];

    const actions = [
        {
            action: "View More",
            background: "#2196F3",
            hover: "#1976D2",
            to: `/${auth.authRole[0]}/pgprs/${pgprId}/ser/${serId}/EditSer/`,
            onclick: () => {
                console.log("Edit");
            },
        },
        {
            action: "Summary",
            background: "#4CAF50",
            hover: "#388E3C",
            onclick: () => {
                console.log("Summary");
            },
        },
    ];

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [warningOpen, setWarningOpen] = useState(false);

    const WarningMessage = () => {
        return (
            <Modal
                open={warningOpen}
                onClose={() => { setWarningOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Not all the standards are submitted!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Typography>
                            Are you sure you want to continue?
                            <Button variant="contained" color="success" component={Link} to={'/programme_coordinator/pgprs/' + pgprId +'/ser/'+serId+'/submitSER'}>
                                Submit
                            </Button>
                            <Button variant="contained" color="error" onClick={() => { setWarningOpen(false)}}>
                                Cancel
                            </Button>
                        </Typography>
                    </Typography>
                </Box>
            </Modal>
        );
    };


    const navigate = useNavigate();


    //first checks submitted evidences count, if zero then do not proceed to evaluation submission
    //if not zero, then check if all the standards are submitted, if not then gives a warning message
    //if all the standards are submitted then proceed to evaluation submission
    const handleEvaulationSubmit = () => {
        const submittedEvidenceCount = ser.evidenceGivenStandards.flatMap(standard => standard.evidences).length;
        if (submittedEvidenceCount === 0) {
            alert("No evidences submitted");
        } else {
            const submittedStandardCount = ser.evidenceGivenStandards.length;
            const totalStandardCount = ser.criterias.flatMap(criteria => criteria.standards).length;
            if (submittedStandardCount !== totalStandardCount) {
                setWarningOpen(true);
            } else {
                navigate('/programme_coordinator/pgprs/' + pgprId +'/ser/'+serId+'/submitSER');
            }
        }
    }

    return (
        <>
            <WarningMessage/>
            <Divider textAlign="left">
                <Chip label="Postgraduate Programme Review" />
            </Divider>
            <Box
                sx={{
                    height: "auto",
                    backgroundColor: "#D8E6FC",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginY: "1rem",
                }}
            >
                <Grid container spacing={1} columns={{ sm: 6, md: 12 }} key='gridContainer'>
                    {headerInfo.map((infoItem, index) => (
                        <>
                            <Grid item sm={2} md={2} key={index + infoItem.label +'label'}>
                                <Typography variant="body1" textAlign={"left"} key={index + infoItem.label + 'labelTypo'}>
                                    <b>{infoItem.label}</b>
                                </Typography>
                            </Grid>
                            <Grid item sm={4} md={4} key={index + infoItem.value + 'value'}>
                                <Typography variant="body1" textAlign={"left"} key={index + infoItem.label + 'valueTypo'}>
                                    {infoItem.value}
                                </Typography>
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Box>
            <Divider textAlign="left">
                <Chip label="Self Evaluation Report" />
            </Divider>
            <TableContainer
                component={Paper}
                sx={{ height: "auto", margin: "1rem 0" }}
            >
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.column}
                                    align="center"
                                    sx={{
                                        backgroundColor: "#D8E6FC",
                                        paddingY: "0.25rem",
                                        fontWeight: "bold",
                                    }}
                                    colSpan={column.colspan}
                                >
                                    <b>{column.label}</b>
                                </TableCell>
                            ))}
                            {actions.length != 0 && (
                                <TableCell
                                    key="Actions"
                                    sx={{
                                        fontWeight: "bold",
                                        backgroundColor: "#D8E6FC",
                                        textAlign: "center",
                                    }}
                                >
                                    Actions
                                </TableCell>
                            )}
                        </TableRow>
                        <TableRow>
                            <TableCell
                                colSpan={2}
                                sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25" }}
                                align="left"
                            >
                                <b></b>
                            </TableCell>
                            {Array.from({ length: 5 }, (_, index) => index + 1).map(
                                (number, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25rem" }}
                                    >
                                        <b>Y{number}</b>
                                    </TableCell>
                                )
                            )}
                            <TableCell
                                align="center"
                                sx={{ backgroundColor: "#D8E6FC", paddingY: "0.25rem" }}
                            >
                                <b></b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoaded && ser.criterias.map((row) => (
                            <TableRow
                                hover
                                key={row.id + row.name}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell sx={{ paddingY: "0.5rem" }}>
                                    {row.id + ". " + row.name}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {row.standards.filter(standard => ser.evidenceGivenStandards.map(evidenceStandard => evidenceStandard.id).includes(standard.id)).length + "/" + row.standards.length}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(1)).length}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(2)).length}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(3)).length}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(4)).length}
                                </TableCell>
                                <TableCell align="center" sx={{ paddingY: "0.5rem" }}>
                                    {ser.evidenceGivenStandards.filter(standard => row.standards.map(standard => standard.id).includes(standard.id)).flatMap(standard => standard.evidences).filter(evidence => evidence.applicableYears?.includes(5)).length}
                                </TableCell>
                                {actions.length != 0 && (
                                    <TableCell sx={{ display: "flex", justifyContent: "center", paddingY: "0.5rem" }}>
                                        {actions.map((action) => (
                                            <Button
                                                component={Link}
                                                to={action.to + row.id}
                                                key={action.action}
                                                variant="contained"
                                                size="small"
                                                value={row.id}
                                                sx={{
                                                    background: action.background,
                                                    color: "#fff",
                                                    "&:hover": {
                                                        background: action.hover,
                                                    },
                                                    marginRight: "10px",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    "&:lastChild": {
                                                        marginRight: "0",
                                                    },
                                                }}
                                            >
                                                {action.action}
                                            </Button>
                                        ))}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {auth.authRole[0] === 'programme_coordinator' && //Only programme coordinator can submit for evaluation
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "end",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="normal"
                        sx={{ float: "right" }}
                        onClick={handleEvaulationSubmit}
                    >
                        <Typography variant="body1">
                            Submit For Evaulation
                        </Typography>
                    </Button>
                </Box>
            }
        </>
    );
};

export default SelfEvaluationReport;