import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import {CircularProgress, Typography} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Alert, Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../../api/api.js';
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import getAllPGPRApplications from '../../api/PostGraduateProgramApplication/getAllPGPRApplications';
import submitPGPRApplication from '../../api/PostGraduateProgramApplication/submitPGPRApplication';

function PGPRApplications() {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = useState(false);
    const [PGPRApplications, setPGPRApplications] = useState([]);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [pgprApplication, setPGPRApplication] = useState({});

    useSetUserNavigations(
        [
            {
              name: "PGPR Applications",
              link: "/PGPRApplications"
            },
          
        ]
    );

    const handleClickOpen = (pgprAppli) => {
        if(pgprAppli.intentLetter==null){
            setMessage("Please upload the intent letter before submitting the application.");
        }
        else{
            setPGPRApplication(pgprAppli.id);
            setOpen(true);
        }
      };

    const handleClose = () => {
        setOpen(false);
    };
    // handleClickSubmitPGPRApplication(pgprApplication.id)
    async function handleGetPGPRApplications () {
        setLoading(true);
        setMessage("");
        
        try{
            await axios.get("/sanctum/csrf-cookie");
            const pgprResult = await getAllPGPRApplications();
            console.log(pgprResult.data.data);
            setPGPRApplications(pgprResult?.data?.data);
        }
        catch(err){
            console.log("error: ",err);
            setPGPRApplications([]);
        }

        setLoading(false);
    }

    useEffect(() => {
        document.title = "PGPR Applications";        
        handleGetPGPRApplications();
    }, []);

    const handleClickSubmitPGPRApplication = async(pgprApplicationID) => {
        setOpen(false);
        setLoading(true);
        await axios.get("/sanctum/csrf-cookie");
        const handleSubmit = await submitPGPRApplication(pgprApplicationID);
       
        handleSubmit.then(res => {
            console.log(res.data.data);
            setSuccess(true);
            handleGetPGPRApplications();
            // setMessage("PGPR Application submitted successfully.");
            //should false after message is shown
        })
        .catch(err => {
            console.log("error: ",err);
            setSuccess(false);
            if(err?.response?.status == 400)
            {
                setMessage(err?.response?.data?.message);
                console.log(err?.response?.data?.message);
            }
            else{
                setMessage("Error in submitting PGPR Application, please try again later.");
            }
        })
        setLoading(false);
        
    }

    const rows = PGPRApplications.map((pgprApplication) => {
        let disableBTNs = {};
        let disableViewBTN = {};
        if(pgprApplication.status === "approved")
        {
            disableBTNs = {disabled:true}
        }
        else if(pgprApplication.status === "submitted")
        {
            disableViewBTN = {disabled:true}
            disableBTNs = {disabled:true}
        }
        else{
            disableBTNs = {disabled:false}
            disableViewBTN = {disabled:false}
        }
        return {
            id: "PGPRApplic..."+pgprApplication.id,
            applicationDate: pgprApplication.applicationDate,
            status: pgprApplication.status,
            intentLetter: pgprApplication.intentLetter==null? "Not Uploaded Yet" : "Uploaded",
            Actions: [
                <Link key={1} to={`view/${pgprApplication.id}`}><Button variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}}>View</Button></Link>,
                <Link key={2} to={disableBTNs.disabled? '':`edit/${pgprApplication.id}`}><Button {...disableBTNs} variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}}>Edit</Button></Link>,
                <Button key={3} {...disableBTNs} {...disableViewBTN} variant="contained" style={{margin:"0 0 0 1rem",boxShadow:'2px 3px 8px 1px #888888'}} onClick={()=>handleClickOpen(pgprApplication)}>Submit</Button>
            ],
        }
    });

    return (
        <>
            {loading &&
                <div style={{position:'absolute',left:0,margin:"0 auto",display:"flex",justifyContent:"center",alignItems:"center"}}> 
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
            <Typography align='center' fontWeight={600} variant="h5" gutterBottom component="div" style={{marginRight:'20px'}}>
                Postgraduate programme review Applications
            </Typography>
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
                        <TableCell align="center"><b>Intent Letter</b></TableCell>
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
                                <TableCell align="center">{row.intentLetter}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">{row.Actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {rows.length == 0 &&
                <Typography align='center' variant="body1" gutterBottom component="div" style={{marginRight:'20px'}}>
                No Data Found
            </Typography>
            }

            <Snackbar
                open={message == "" ? false : true}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setMessage("")}
                >
                <Alert onClose={() => setMessage("")} severity="error">
                {message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={1500}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                <Alert onClose={() => setSuccess(false)} severity="success">
                    Submitted Successfully!
                </Alert>
            </Snackbar>

            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="submit-application"
            >
                <DialogTitle id="submit-applicationID">
                {"Are you sure that you want to submit this application?"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Once you submit this application, you will not be able to edit it again.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    cancel
                </Button>
                <Button onClick={()=>handleClickSubmitPGPRApplication(pgprApplication)} autoFocus>
                    submit
                </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default PGPRApplications