import { useState, useEffect } from 'react';
import getAllPGPRApplications from '../../api/PostGraduateProgramApplication/getAllPGPRApplications';
import {CircularProgress, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { Button, ButtonGroup, Box, Alert, Snackbar } from '@mui/material';
import { SERVER_URL } from '../../assets/constants.js';
import approvePGPRApplicationByQAC from '../../api/PostGraduateProgramApplication/approvePGPRApplicationByQAC';

const PostGraduateProgramReviewApplications = () => {
    const [pgprs, setPgprs] = useState([]);

    const [clickedApplicationId, setClickedApplicationId] = useState(null);

    const handleApprove = async (e) => {
        setClickedApplicationId(e.target.value);

        try{
            const approveResult = await approvePGPRApplicationByQAC(e.target.value, 'approved');

            if(approveResult.status === 200){
                alert(approveResult.data.message);
                setClickedApplicationId(null);
            }
        }
        catch(error){
            console.log(error);
            alert(error.response.data.message);
            setClickedApplicationId(null);
        }
    }

    const handleReject = async (e) => {
        setClickedApplicationId(e.target.value);

        try{
            const rejectResult = await approvePGPRApplicationByQAC(e.target.value, 'rejected');

            if(rejectResult.status === 200){
                alert(rejectResult.data.message);
                setClickedApplicationId(null);
            }
        }
        catch(error){
            console.log(error);
            alert(error.response.data.message);
            setClickedApplicationId(null);
        }
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
            try{
                const pgprResult = await getAllPGPRApplications({includeUniversity: true, includeFaculty: true, includePostGraduateProgram: true});
                setPgprs(pgprResult.data.data);
                console.log(pgprResult.data.data);
            }
            catch(error){
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
            <Typography variant="h5" align="center" sx={{marginBottom:"2rem"}}>Post Graduate Program Applications</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead style={{backgroundColor:"#D8E6FC",}}>
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
                                        <Button sx={{margin:"0 0.5rem"}} variant="contained" color="primary" disabled={row.status === 'approved' || row.status === 'rejected'} value={row.id} onClick={handleApprove}>Approve</Button>
                                        <Button sx={{margin:"0 0.5rem"}} variant="contained" color="primary" disabled={row.status === 'approved' || row.status === 'rejected'} value={row.id} onClick={handleReject}>Reject</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default PostGraduateProgramReviewApplications