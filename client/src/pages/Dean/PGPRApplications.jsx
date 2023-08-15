import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import {CircularProgress, Typography} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/api.js';
import { useEffect, useState } from 'react';

function PGPRApplications() {

    const [loading, setLoading] = useState(false);
    const [PGPRApplications, setPGPRApplications] = useState([]);
    const [submittedPGPRApplications, setSubmittedPGPRApplications] = useState(false);
    const [message, setMessage] = useState("");

    useSetUserNavigations(
        [
            {
              name: "PGPR Applications",
              link: "/PGPRApplications"
            },
          
        ]
    );

    useEffect(() => {
        document.title = "PGPR Applications";
        
        async function getPgprApplications () {
            setLoading(true);
            await axios.get("/sanctum/csrf-cookie");
            await axios.get(SERVER_URL + SERVER_API_VERSION +'pgprApplications/')
            .then(res => {
                console.log(res.data.data);
                setPGPRApplications(res?.data?.data);
            })
            .catch(err => {
                console.log("error: ",err);
                setPGPRApplications([]);
            })
            setLoading(false);
        }
        
        getPgprApplications();
    }, []);

    const handleClickSubmitPGPRApplication = async(pgprApplicationID) => {
        setLoading(true);
        await axios.get("/sanctum/csrf-cookie");
        await axios.post(SERVER_URL + SERVER_API_VERSION +'pgprApplications/'+pgprApplicationID+'/submit')
        .then(res => {
            console.log(res.data.data);
            setSubmittedPGPRApplications(true);
            setMessage("PGPR Application submitted successfully.");
            //should false after message is shown
        })
        .catch(err => {
            console.log("error: ",err);
            setSubmittedPGPRApplications(false);
            setMessage("Error in submitting PGPR Application, please try again later.");
        })
        setLoading(false);
    }

    const rows = PGPRApplications.map((pgprApplication) => {
        let disableBTN = {disabled:false};
        if(pgprApplication.status === "approved")
        {
            disableBTN = {disabled:true}
        }
        return {
            id: "PGPRApplic..."+pgprApplication.id,
            applicationDate: pgprApplication.applicationDate,
            status: pgprApplication.status,
            Actions: [
                <Link key={1} to={`view/${pgprApplication.id}`}><Button variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}}>View</Button></Link>,
                <Link key={2} to={`edit/${pgprApplication.id}`}><Button {...disableBTN} variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}}>Edit</Button></Link>,
                <Button key={3} {...disableBTN} variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}} onClick={()=>handleClickSubmitPGPRApplication(pgprApplication.id)}>Submit</Button>
            ],
        }
    });

    return (
        <>
            {loading &&
                <div style={{position:'absolute',left:0,right:0,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center"}}> 
                    <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                        Loading Data...
                    </Typography>
                    <CircularProgress
                    style={{ margin: "0 0 0 20px", color: "darkblue" }}
                    thickness={5}
                    size={24}
                    />
                </div>
            }
            <Box sx={{
                display:'flex',alignItems:'center',justifyContent:'flex-end',
            }}>
                <Link to="create">
                    <Button variant="contained" style={{margin:"2rem 0 0",boxShadow:'2px 3px 8px 1px #888888'}}>Create New PGPR Application</Button>
                </Link>
            </Box>

            <TableContainer style={{margin:"1rem 0"}} component={Paper} >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{backgroundColor:"#D8E6FC",}}>
                        <TableRow>
                        <TableCell><b>PGPR Application ID</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index) => (
                            <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{row.Actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </>
    )
}

export default PGPRApplications