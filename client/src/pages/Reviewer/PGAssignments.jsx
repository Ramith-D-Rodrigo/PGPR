import React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import { Typography } from '@mui/material';
import { useState } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

// import axios from 'axios';
// import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import {Link} from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useAuth from "../../hooks/useAuth.js";
import CloseIcon from '@mui/icons-material/Close';

const pgAssignments = () => {
    const {auth} = useAuth();
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            }
        ]
    );

    const [selectedFilterKeys, setSelectedFilterKeys] = useState([{ title: 'In-review' }]);
    const [AcceptClicked, setAcceptClicked] = useState(false);
    const [acceptAssignment, setAcceptAssignment] = useState(false);
    const [selectedPGPRID, setSelectedPGPRID] = useState(null);

    function handleSubmitAssignment() {
        console.log("Accept Clicked : ",selectedPGPRID);
    }

    function handleRejectAssignment() {
        console.log("Reject Clicked : ",selectedPGPRID);
        setAcceptClicked(false);
        setSelectedPGPRID(null);
    }

    function handleClickCancel() {
        setAcceptClicked(false);
        setAcceptAssignment(false);
        setSelectedPGPRID(null);
    }

    function handleDownloadLetter() {
        console.log("Download Letter Clicked : ",selectedPGPRID);
    }

    function handleClickAccept(pgprID) {
        setAcceptClicked(true);
        setSelectedPGPRID(pgprID);
        // console.log("Accept Clicked : ",pgprID);
    }

    function createData(pgprID,University_Name, faculty_Name, pgp, Role, status, Actions) {
        Actions = Actions.map((action,index) => {
            
            let allow = action.allow? {disabled:false} : {disabled:true};
            if(action.action === 'View')
            {
                return <Link key={index} to={action.allow? 'ViewSer/'+pgprID:''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'Accept')
            {
                return <Button key={index} onClick={()=>{handleClickAccept(pgprID)}} {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button>
            }
            else if(action.action === 'DE')
            {
                return <Link key={index} to={action.allow? 'Conduct_DE/'+pgprID : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'PE')
            {
                return <Link key={index} to={action.allow? 'Conduct_PE/'+pgprID : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            
        });
        return {pgprID, University_Name, faculty_Name, pgp, Role, status, Actions };
    }

    const rows = [
        createData("Uoc-11",'University of Colombo', "UCSC","MCS","Chairman", 'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
        createData("Uoc-13",'University of Colombo', "FOC","MCS", "Reviewer", 'In-review', [{action:'Accept',allow:true},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
        createData("Uom-17",'University of Moratuwa', "FOE","MCS", "Chairman",'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:true}, {action:'PE',allow:false}]),
        createData("Uok-10",'University of Kelaniya', "FOCS","MCS","Chairman", 'In-review', [{action:'Accept',allow:false},{action:'View',allow:true}, {action:'DE',allow:false}, {action:'PE',allow:false}]),
        createData("Uop-16","University of Peradeniya", "FIT","MCS","Reviewer", 'In-review', [{action:'Accept',allow:true},{action:'View',allow:true}, {action:'DE',allow:true}, {action:'PE',allow:true}]),
      ];

      const statuses = [
        { title: 'In-review' },
        { title: 'Accepted' },
        { title: 'Rejected' },
        { title: 'Pending' },
    ];

    const customEqualityTest = (option, value) => 
    {
        // console.log("option : value : ",option,value);
        return option.title === value.title;
    }

    return (
        <>
            <Box sx={{
                display:'flex',alignItems:'center',justifyContent:'center',width:'100%'
            }}>
                <Autocomplete
                    sx={{width:'50%',marginBottom:'20px',}}
                    multiple
                    id="tags-standard"
                    options={statuses}
                    getOptionLabel={(option) => option.title}
                    // defaultValue={[statuses[0]]}
                    value={selectedFilterKeys}
                    onChange={(event, newValue) => {
                        setSelectedFilterKeys(newValue);
                        // console.log(newValue);
                    }}
                    isOptionEqualToValue={customEqualityTest}
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Filter by Status"
                        placeholder="Select option"
                    />
                    )}
                />
            </Box>
            <ScrollableDiv height="500px">
                <TableContainer component={Paper} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead style={{backgroundColor:"#D8E6FC",}}>
                            <TableRow>
                            <TableCell align="left"><b>PGPR-ID</b></TableCell>
                            <TableCell align="center"><b>University Name</b></TableCell>
                            <TableCell align="center"><b>Faculty/Institute</b></TableCell>
                            <TableCell align="center"><b>PGP</b></TableCell>
                            <TableCell align="center"><b>Role</b></TableCell>
                            <TableCell align="center"><b>Status</b></TableCell>
                            <TableCell align="center"><b>Actions</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                key={row.pgprID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.pgprID}
                                    </TableCell>
                                    <TableCell align="center">{row.University_Name}</TableCell>
                                    <TableCell align="center">{row.faculty_Name}</TableCell>
                                    <TableCell align="center">{row.pgp}</TableCell>
                                    <TableCell align="center">{row.Role}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">{row.Actions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ScrollableDiv>
            { AcceptClicked &&
                <Box sx={{
                    position:'absolute',margin:'0 auto',left:0,right:0,bottom:0,top:0,
                    display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center',
                    width:'50%',height:'90%',marginTop:'20px',backgroundColor:'#D8E6FC',
                    borderRadius:'10px',padding:'60px',boxShadow:'0 0 5px 0px black',
                    }}
                >
                    <Typography variant="h5" gutterBottom component="div" style={{marginRight:'20px'}}>
                            {acceptAssignment? "Upload the Appointment Letter" : "Accept Chairman Assignment"}
                    </Typography>
                    {!acceptAssignment &&
                    <>
                        <Typography variant="h6" gutterBottom component="div" style={{marginRight:'20px'}}>
                            Reviever Name: <b>{auth.fullName}</b>
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div" style={{marginRight:'20px'}}>
                            It's happy to inform you that you have been appointed as a reviewer/Chairman for postgraduate programs by QAC. Click below to download the appointment letter.
                        </Typography>
                        <Button variant="contained" color="primary" size="large" onClick={handleDownloadLetter}>
                            Download Appointment Letter
                        </Button>
                        <Box sx={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                            <Button variant="contained" color="primary" size="large" onClick={()=>setAcceptAssignment(true)}>
                                Accept Assignment
                            </Button>
                            <Button variant="contained" color="primary" size="large" onClick={handleRejectAssignment}>
                                Reject Assignment
                            </Button>
                        </Box>
                    </>
                    }
                    {acceptAssignment &&
                    <>
                        <TextField
                            sx={{margin:"15px 0",width:"100%",height:"100%"}}
                            id="letter"
                            type='file' 
                        />
                        <Box sx={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                            <Button variant="contained" color="primary" size="large" onClick={handleSubmitAssignment}>
                                Submit
                            </Button>
                            <Button variant="contained" color="primary" size="large" onClick={()=> setAcceptAssignment(false)}>
                                Cancel
                            </Button>
                        </Box>
                    </>
                    }
                    <IconButton onClick={handleClickCancel} style={{position:"absolute",right:15,top:15}}>
                        <CloseIcon fontSize='large' />
                    </IconButton>
                </Box>
            }
        </>
    )
}

export default pgAssignments
