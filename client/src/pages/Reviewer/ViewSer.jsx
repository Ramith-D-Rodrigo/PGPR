import React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import Card from '../../components/DashboardCard';
import { Grid } from '@mui/material';
import { useState } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

// import axios from 'axios';
// import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import {Link} from 'react-router-dom';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const ViewSer = () => {
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignment"
            }
        ]
    );

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);
    const [selectedFilterKeys, setSelectedFilterKeys] = useState([{ title: 'In-review' }]);

    let newHeight = open ==true? `${90-expand}%` : `calc( ${90-expand}% - 40px )`;
    const handleClick = ()=>{
        if(expand==8)
        {
        setexpand(descriptionWidth);
        }
        else{
        setexpand(8);
        }
    };

    function createData(pgprID,University_Name, faculty_Name, pgp, Role, status, Actions) {
        Actions = Actions.map((action,index) => {
            
            let allow = action.allow? {disabled:false} : {disabled:true};
            if(action.action === 'View')
            {
                return <Link key={index} to={action.allow? 'view/'+pgprID:''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'Accept')
            {
                return <Link key={index} to={action.allow? 'edit/'+pgprID : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'DE')
            {
                return <Link key={index} to={action.allow? 'delete/'+pgprID : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'PE')
            {
                return <Link key={index} to={action.allow? 'delete/'+pgprID : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
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
      </>
    )
}

export default ViewSer
