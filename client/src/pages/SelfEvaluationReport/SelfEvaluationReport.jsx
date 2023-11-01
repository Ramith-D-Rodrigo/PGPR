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
    Button,
    ButtonGroup
} from "@mui/material";

import { useParams } from "react-router-dom";
import React,{ useEffect, useState } from "react";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Modal from '@mui/material/Modal';

import recommendSelfEvaluationReport from "../../api/SelfEvaluationReport/recommendSelfEvaluationReport";
import getAssignedPGPRs from "../../api/Reviewer/getAssignedPGPR";

import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import { PropTypes } from "prop-types";


const SelfEvaluationReport = () => {

    const {serId, pgprId} = useParams();

    const [ser, setSer] = useState({});

    const [isLoaded, setIsLoaded] = useState(false);

    const [headerInfo, setHeaderInfo] = useState([]);
    const [pgProgram, setPgProgram] = useState({});
    const {auth} = useAuth();

    document.title = "Self Evaluation Report";

    useEffect(() => {
            const getPGPRData = async () => {
                try {
                    const response = await getSelfEvaluationReport(serId);
                    if (response && response.status === 200) {
                        setSer(response.data.data);
                        const ser = response.data.data;
                        //console.log(response.data.data);

                        setHeaderInfo(
                            [
                                {
                                    label: "University:",
                                    value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.university.name
                                },
                                {
                                    label: "Faculty/Institute:",
                                    value: ser.postGraduateProgramReview.postGraduateProgramme.faculty.name,
                                },
                                {label: "PGPR ID:", value: "PGPR-" + ser.postGraduateProgramReview.id},
                                {label: "PGPR Name:", value: ser.postGraduateProgramReview.postGraduateProgramme.title},
                                {
                                    label: "Application Start Date:",
                                    value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.applicationDate
                                },
                                {
                                    label: "Requested Date:",
                                    value: ser.postGraduateProgramReview.postGraduateProgramReviewApplication.requestDate
                                },
                                {
                                    label: "Program Coordinator:", value:
                                        ser.programmeCoordinator.academicStaff.universitySide.user.surname
                                        + " " +
                                        ser.programmeCoordinator.academicStaff.universitySide.user.initials
                                },
                            ]);

                        if (auth.authRole[0] === 'reviewer') {
                            const assignedPg = await getAssignedPGPRs(pgprId);
                            setPgProgram(
                                assignedPg?.data?.data?.postGraduateReviewProgram
                            );
                        }

                        setIsLoaded(true);
                    }

                } catch (error) {
                    console.log(error);
                }
            }

            useEffect(() => {

                getPGPRData();

            }, [serId]);

            if (auth.authRole[0] === 'reviewer') {
                useSetUserNavigations([
                    {
                        name: "PG Assignments",
                        link: "/PG_Assignments"
                    },
                    {
                        name: "View SER",
                        link: "/PG_Assignments/" + serId + "/ser/" + pgprId
                    },
                ]);
            } else {
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
                        name: "Self Evaluation Report",
                        link: window.location.pathname,
                    },
                ]);
            }

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
                }
            ];

            const style = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: '0.5rem',
                p: 4,
            };

            const [warningOpen, setWarningOpen] = useState(false);

            const [warningType, setWarningType] = useState('');

            const WarningMessage = ({warningType}) => {
                WarningMessage.propTypes = {
                    warningType: PropTypes.string.isRequired
                };
                return (
                    <Modal
                        open={warningOpen}
                        onClose={() => {
                            setWarningOpen(false)
                        }}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Box sx={{width: '100%', fontSize: '2rem', textAlign: 'center', mb: '2rem'}}>
                                Not all the standards are submitted!
                            </Box>
                            {
                                warningType === 'submit' ?
                                    <>
                                        <Box sx={{my: '1rem'}}>
                                            Not all the standards are submitted! Do you want to proceed to evaluation
                                            submission?
                                        </Box>
                                        <ButtonGroup sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            my: '1rem'

                                        }}>
                                            <Button variant="contained" color="primary" component={Link}
                                                    to={'/programme_coordinator/pgprs/' + pgprId + '/ser/' + serId + '/submitSER'}>
                                                Proceed
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => {
                                                setWarningOpen(false)
                                            }}>
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </>
                                    :

                                    <>
                                        Not all the standards are submitted! Do you want to recommend the report?
                                        <ButtonGroup sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            my: '1rem'
                                        }}>
                                            <Button variant="contained" color="success"
                                                    onClick={handleReportRecommendationConfirm}>
                                                Recommend
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => {
                                                setWarningOpen(false)
                                            }}>
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </>
                            }

                        </Box>
                    </Modal>
                );
            };


            const navigate = useNavigate();

            const [snackbar, setSnackbar] = useState({
                open: false,
                message: '',
                severity: 'success'
            });


            //first checks submitted evidences count, if zero then do not proceed to evaluation submission
            //if not zero, then check if all the standards are submitted, if not then gives a warning message
            //if all the standards are submitted then proceed to evaluation submission
            const handleEvaulationSubmit = () => {
                const submittedEvidenceCount = ser.evidenceGivenStandards.flatMap(standard => standard.evidences).length;
                if (submittedEvidenceCount === 0) {
                    setSnackbar({
                        open: true,
                        message: 'No evidences submitted',
                        severity: 'error'
                    });

                } else {
                    const submittedStandardCount = ser.evidenceGivenStandards.length;
                    const totalStandardCount = ser.criterias.flatMap(criteria => criteria.standards).length;
                    if (submittedStandardCount !== totalStandardCount) {
                        setWarningType('submit');
                        setWarningOpen(true);
                    } else {
                        navigate('/programme_coordinator/pgprs/' + pgprId + '/ser/' + serId + '/submitSER');
                    }
                }
            }

            const handleReportRecommendation = async () => {
                const submittedEvidenceCount = ser.evidenceGivenStandards.flatMap(standard => standard.evidences).length;
                if (submittedEvidenceCount === 0) {
                    setSnackbar({
                        open: true,
                        message: 'No evidences submitted',
                        severity: 'error'
                    });
                } else {
                    const submittedStandardCount = ser.evidenceGivenStandards.length;
                    const totalStandardCount = ser.criterias.flatMap(criteria => criteria.standards).length;
                    if (submittedStandardCount !== totalStandardCount) {
                        setWarningType('recommend');
                        setWarningOpen(true);
                    } else {
                        await handleReportRecommendationConfirm();
                    }
                }
            }

            const handleReportRecommendationConfirm = async () => {
                try {
                    setSnackbar({
                        open: true,
                        message: 'Recommending report...',
                        severity: 'info'
                    });


                    const response = await recommendSelfEvaluationReport(serId);

                    if (response && response.status === 200) {
                        setSnackbar({
                            open: true,
                            message: 'Report recommended successfully',
                            severity: 'success'
                        });

                        getPGPRData();
                    }
                } catch (error) {
                    console.log(error);
                    setSnackbar({
                        open: true,
                        message: 'Report recommendation failed',
                        severity: 'error'
                    });
                }

                setWarningOpen(false);
                setWarningType('');
            }

            return (
                <>
                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={() => setSnackbar({...snackbar, open: false})}
                        anchorOrigin={{vertical: "top", horizontal: "center"}}
                    >
                        <Alert
                            onClose={() => setSnackbar({...snackbar, open: false})}
                            severity={snackbar.severity}
                            sx={{width: "100%"}}
                        >
                            {snackbar.message}
                        </Alert>
                    </Snackbar>

                    <WarningMessage warningType={warningType}/>
                    <Divider textAlign="left">
                        <Chip label="Postgraduate Programme Review"/>
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
                        <Grid container spacing={1} columns={{sm: 6, md: 12}}>
                            {headerInfo.map((infoItem, index) => (
                                <React.Fragment key={index}>
                                    <Grid item sm={2} md={2}>
                                        <Typography variant="body1" textAlign="left">
                                            <b>{infoItem.label}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item sm={4} md={4}>
                                        <Typography variant="body1" textAlign="left">
                                            {infoItem.value}
                                        </Typography>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Box>
                    <Divider textAlign="left">
                        <Chip label="Self Evaluation Report"/>
                    </Divider>
                    <TableContainer
                        component={Paper}
                        sx={{height: "auto", margin: "1rem 0"}}
                    >
                        <Table sx={{minWidth: 650}} stickyHeader aria-label="sticky table">
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
                                        sx={{backgroundColor: "#D8E6FC", paddingY: "0.25"}}
                                        align="left"
                                    >
                                        <b></b>
                                    </TableCell>
                                    {Array.from({length: 5}, (_, index) => index + 1).map(
                                        (number, index) => (
                                            <TableCell
                                                key={index}
                                                align="center"
                                                sx={{backgroundColor: "#D8E6FC", paddingY: "0.25rem"}}
                                            >
                                                <b>Y{number}</b>
                                            </TableCell>
                                        )
                                    )}
                                    <TableCell
                                        align="center"
                                        sx={{backgroundColor: "#D8E6FC", paddingY: "0.25rem"}}
                                    >
                                        <b></b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoaded &&
                                    ser.criterias.map((row) => (
                                        <TableRow
                                            hover
                                            key={row.id + row.name}
                                            sx={{"&:last-child td, &:last-child th": {border: 0}}}
                                        >
                                            <TableCell sx={{paddingY: "0.5rem"}}>
                                                {row.id + ". " + row.name}
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {row.standards.filter((standard) =>
                                                        ser.evidenceGivenStandards
                                                            .map((evidenceStandard) => evidenceStandard.id)
                                                            .includes(standard.id)
                                                    ).length +
                                                    "/" +
                                                    row.standards.length}
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {
                                                    ser.evidenceGivenStandards
                                                        .filter((standard) =>
                                                            row.standards
                                                                .map((standard) => standard.id)
                                                                .includes(standard.id)
                                                        )
                                                        .flatMap((standard) => standard.evidences)
                                                        .filter((evidence) =>
                                                            evidence.applicableYears?.includes(1)
                                                        ).length
                                                }
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {
                                                    ser.evidenceGivenStandards
                                                        .filter((standard) =>
                                                            row.standards
                                                                .map((standard) => standard.id)
                                                                .includes(standard.id)
                                                        )
                                                        .flatMap((standard) => standard.evidences)
                                                        .filter((evidence) =>
                                                            evidence.applicableYears?.includes(2)
                                                        ).length
                                                }
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {
                                                    ser.evidenceGivenStandards
                                                        .filter((standard) =>
                                                            row.standards
                                                                .map((standard) => standard.id)
                                                                .includes(standard.id)
                                                        )
                                                        .flatMap((standard) => standard.evidences)
                                                        .filter((evidence) =>
                                                            evidence.applicableYears?.includes(3)
                                                        ).length
                                                }
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {
                                                    ser.evidenceGivenStandards
                                                        .filter((standard) =>
                                                            row.standards
                                                                .map((standard) => standard.id)
                                                                .includes(standard.id)
                                                        )
                                                        .flatMap((standard) => standard.evidences)
                                                        .filter((evidence) =>
                                                            evidence.applicableYears?.includes(4)
                                                        ).length
                                                }
                                            </TableCell>
                                            <TableCell align="center" sx={{paddingY: "0.5rem"}}>
                                                {
                                                    ser.evidenceGivenStandards
                                                        .filter((standard) =>
                                                            row.standards
                                                                .map((standard) => standard.id)
                                                                .includes(standard.id)
                                                        )
                                                        .flatMap((standard) => standard.evidences)
                                                        .filter((evidence) =>
                                                            evidence.applicableYears?.includes(5)
                                                        ).length
                                                }
                                            </TableCell>
                                            {actions.length != 0 && (
                                                <TableCell
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        paddingY: "0.5rem",
                                                    }}
                                                >
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
                                                            disabled={
                                                                auth.authRole[0] === "reviewer" ||
                                                                auth.authRole[0] === "qac_director" ||
                                                                auth.authRole[0] === "qac_officer"
                                                            }
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

                    {auth.authRole[0] === "programme_coordinator" &&
                        ser?.postGraduateProgramReview?.statusOfPgpr == "PLANNING" && ( //Only programme coordinator can submit for evaluation and only if the status of the PGPR is PLANNING
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
                                    sx={{float: "right"}}
                                    onClick={handleEvaulationSubmit}
                                >
                                    <Typography variant="body1">Submit For Evaluation</Typography>
                                </Button>
                            </Box>
                        )}

                    {ser?.postGraduateProgramReview?.statusOfPgpr == "PLANNING" &&
                        ser?.sectionA !== null &&
                        ser?.sectionB !== null &&
                        ser?.sectionD !== null &&
                        ser?.finalSerReport !== null &&
                        (auth.authRole[0] === "vice_chancellor" ||
                            auth.authRole[0] === "cqa_director") && (
                            //Only vc and cqa director can recommend the report and only if the status of the PGPR is PLANNING
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
                                    sx={{float: "right"}}
                                    onClick={handleReportRecommendation}
                                    disabled={
                                        (auth.authRole[0] === "vice_chancellor" &&
                                            ser?.viceChancellorId !== null) ||
                                        (auth.authRole[0] === "cqa_director" &&
                                            ser?.centerForQualityAssuranceDirectorId !== null)
                                    }
                                >
                                    <Typography variant="body1">
                                        {(auth.authRole[0] === "vice_chancellor" &&
                                            ser?.viceChancellorId !== null) ||
                                        (auth.authRole[0] === "cqa_director" &&
                                            ser?.centerForQualityAssuranceDirectorId !== null)
                                            ? "Report already recommended"
                                            : "Recommend Report"}
                                    </Typography>
                                </Button>
                            </Box>
                        )}
                    {auth.authRole[0] === "reviewer" &&
                        (pgProgram?.statusOfPgpr === "DE" ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "100%",
                                    padding: "20px 0",
                                    height: "auto",
                                }}
                            >
                                <Link to={`../Conduct_DE/${pgprId}`}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            width: "300px",
                                            height: "55px",
                                        }}
                                        color="primary"
                                    >
                                        Go to Desk Evaluation
                                    </Button>
                                </Link>
                            </Box>
                        ) : pgProgram?.statusOfPgpr === "PE1" ||
                        pgProgram?.statusOfPgpr === "PE2" ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "100%",
                                    padding: "20px 0",
                                    height: "auto",
                                }}
                            >
                                <Link to={`../Conduct_PE/Assigned_criteria/${pgprId}`}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            width: "300px",
                                            height: "55px",
                                        }}
                                        color="primary"
                                    >
                                        Go to Proper Evaluation
                                    </Button>
                                </Link>
                            </Box>
                        ) : (
                            ""
                        ))}
                </>
            );
        }
    );
}

export default SelfEvaluationReport;
