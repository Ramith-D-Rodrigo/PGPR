import { useState, useEffect } from 'react';
import getAllPGPRApplications from '../../api/PostGraduateProgramApplication/getAllPGPRApplications';
import { Chip, CircularProgress, Divider, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import DialogMenu from '../../components/DialogMenu';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Button, ButtonGroup, Box, Alert, Snackbar } from '@mui/material';
import { SERVER_URL } from '../../assets/constants.js';
import approvePGPRApplicationByQAC from '../../api/PostGraduateProgramApplication/approvePGPRApplicationByQAC';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const PostGraduateProgramReviewApplications = () => {
    const [pgprs, setPgprs] = useState([]);
    const [clickedApplicationId, setClickedApplicationId] = useState(null);
    const [openDialog, setOpenDialog] = useState([false, false, null]);   // [ submit , cancel, id ]
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [wait, setWait] = useState(false);

    document.title = "PGPR Applications";

    useSetUserNavigations(
        [{
            name: "Dashboard",
            link: "/"
        },
        {
            name: "Post Graduate Program Review Applications",
            link: "/PGPRApplications"
        },
        ]
    );

    const handleApprove = async () => {
        const pgprApplicationID = openDialog[2];
        setClickedApplicationId(pgprApplicationID);

        try {
            setWait(true);

            const approveResult = await approvePGPRApplicationByQAC(pgprApplicationID, 'approved');

            setWait(false);
            if (approveResult.status === 200) {
                setSuccessMsg(approveResult.data.message);

                //modify the pgpr application status
                const newPgprs = [...pgprs];
                const index = newPgprs.findIndex((pgpr) => pgpr.id === pgprApplicationID);
                newPgprs[index].status = 'approved';
                setPgprs(newPgprs);
                setClickedApplicationId(null);
            }
        }
        catch (error) {
            console.log(error);
            setWait(false);
            setErrorMsg(error.response.data.message);
            setClickedApplicationId(null);
        }
    }

    const handleReject = async () => {
        const pgprApplicationID = openDialog[2];
        setClickedApplicationId(pgprApplicationID);

        try {
            setWait(true);

            const rejectResult = await approvePGPRApplicationByQAC(pgprApplicationID, 'rejected');
            setWait(false);
            if (rejectResult.status === 200) {
                setSuccessMsg(rejectResult.data.message);

                //modify the pgpr application status
                const newPgprs = [...pgprs];
                const index = newPgprs.findIndex((pgpr) => pgpr.id === pgprApplicationID);
                newPgprs[index].status = 'rejected';
                setPgprs(newPgprs);

                setClickedApplicationId(null);
            }
        }
        catch (error) {
            setWait(false);
            setErrorMsg(error.response.data.message);
            setClickedApplicationId(null);
        }


    }

    const handleClickReject = (id) => {
        setOpenDialog([false, true, id]);
    }

    const handleClickApprove = (id) => {
        setOpenDialog([true, false, id]);
    }



    const columnHeaders = [
        'Application ID',
        'University',
        'Faculty',
        'Post Graduate Program',
        'Years',
        'Year End Date',
        'Intent Letter',
        'Application Date',
        'Status',
        'Actions'
    ]

    useEffect(() => {
        const getPGPRs = async () => {
            try {
                const pgprResult = await getAllPGPRApplications({ includeUniversity: true, includeFaculty: true, includePostGraduateProgram: true });
                setPgprs(pgprResult.data.data);
                console.log(pgprResult.data.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getPGPRs();
    }, []);

    const handleLetterDownload = (e) => {
        console.log(e.target.value);
        window.open(e.target.value);
    }


    return (
        <>
            <Snackbar
                open={errorMsg == "" ? false : true}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setErrorMsg("")}
            >
                <Alert onClose={() => setErrorMsg("")} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successMsg == "" ? false : true}
                autoHideDuration={1500}
                onClose={() => setSuccessMsg("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMsg("")} severity="success">
                    {successMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={wait}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info">
                    Please wait...
                </Alert>
            </Snackbar>

            <Divider textAlign='left' sx={{ mb: 2 }}>
                <Chip label="Post Graduate Program Review Applications" />
            </Divider>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{ backgroundColor: "#D8E6FC", }}>
                        <TableRow>
                            {columnHeaders.map((header) => (
                                <TableCell key={header} align="center"><strong>{header}</strong></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pgprs.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align='center'>{row.id}</TableCell>
                                <TableCell align='center'>{row.postGraduateProgram.faculty.university.name}</TableCell>
                                <TableCell align='center'>{row.postGraduateProgram.faculty.name}</TableCell>
                                <TableCell align='center'>{row.postGraduateProgram.title}</TableCell>
                                <TableCell align='center'>
                                    {row.year1 + " , " + row.year2 + " , " + row.year3 + " , " + row.year4 + " , " + row.year5}
                                </TableCell>
                                <TableCell align='center'>{row.yEnd}</TableCell>
                                <TableCell align='center'>
                                    <Button value={SERVER_URL.substring(0, SERVER_URL.length - 1) + row.intentLetter} onClick={handleLetterDownload}>
                                        Download
                                    </Button>
                                </TableCell>
                                <TableCell align='center'>{row.applicationDate}</TableCell>
                                <TableCell align='center'>{row.status.toUpperCase()}</TableCell>
                                <TableCell align='center'>
                                    <ButtonGroup>
                                        <Button sx={{ margin: "0 0.5rem" }} variant="contained" color="primary" disabled={row.status === 'approved' || row.status === 'rejected' || wait} value={row.id} onClick={() => handleClickApprove(row.id)}>Approve</Button>
                                        <Button sx={{ margin: "0 0.5rem" }} variant="contained" color="primary" disabled={row.status === 'approved' || row.status === 'rejected' || wait} value={row.id} onClick={() => handleClickReject(row.id)}>Reject</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DialogMenu
                Message={`Are you sure that you want to ${openDialog[0] ? "Approve" : "Reject"} this PostGraduate Program Review application?`}
                Warning={`Once you ${openDialog[0] ? "Approved" : "Rejected"} this application, you will not be able to Change this action again.`}
                Actions={{ cancel: "cancel", submit: openDialog[0] ? "Approve" : "Reject" }}
                Open={(openDialog[0] || openDialog[1]) ?? false}
                onClose={() => setOpenDialog(false, false, null)}
                onSubmit={() => { openDialog[0] ? handleApprove() : handleReject(); setOpenDialog(false, false, null) }}
            />

        </>
    )
}

export default PostGraduateProgramReviewApplications