import * as React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSetUserNavigations from '../../hooks/useSetUserNavigations'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import {Link} from 'react-router-dom';
import { useEffect } from 'react';
import axios from '../../api/api.js';

const ViewReviewers = () => {
    useSetUserNavigations(
      [
          {
            name: "Reviewers",
            link: "/reviewers"
          },
      ]
    );

    useEffect(() => {
        document.title = 'View Reviewers | QAC'

        // async function getUniversities() {
        //     // await axios.get("/sanctum/csrf-cookie");
        //     await axios.get('/api/v1/universities')
        //     .then(res => {
        //         console.log(res.data);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });

        // }

        // getUniversities();
    }, []);

    function createData(id,University_Name, No_of_Faculties, District, Type, Actions) {
        Actions = Actions.map((action,index) => {
            
            let allow = action.allow? {disabled:false} : {disabled:true};
            if(action.action === 'View')
            {
                return <Link key={index} to={action.allow? 'view/'+id:''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'Edit')
            {
                return <Link key={index} to={action.allow? 'edit/'+id : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            else if(action.action === 'Delete')
            {
                return <Link key={index} to={action.allow? 'delete/'+id : ''}><Button {...allow} style={{margin:"0 8px"}} variant="contained" color="primary" size="small">{action.action}</Button></Link>
            }
            
        });
        return {id, University_Name, No_of_Faculties, District, Type, Actions };
    }

    const rows = [
        createData(1,'University of Colombo', 9, 'Colombo', 'Yes', [{action:'View',allow:true}, {action:'Edit',allow:false}, {action:'Delete',allow:false}]),
        createData(2,'University of Peradeniya', 12, 'Peradeniya', 'No', [{action:'View',allow:true}, {action:'Edit',allow:true}, {action:'Delete',allow:false}]),
        createData(3,'University of Ruhuna', 9, 'Ruhuna', 'Yes', [{action:'View',allow:true}, {action:'Edit',allow:false}, {action:'Delete',allow:true}]),
        createData(4,'University of Moratuwa', 5, 'Moratuwa', 'No', [{action:'View',allow:true}, {action:'Edit',allow:false}, {action:'Delete',allow:false}]),
        createData(5,'NSBM', 5, 'Colombo', 'Yes', [{action:'View',allow:true}, {action:'Edit',allow:true}, {action:'Delete',allow:true}]),
      ];

    return (
        <>
        <Box sx={{
            display:'flex',alignItems:'center',justifyContent:'center',padding:'5px 20px',
        }}>
            Search by Reviewer Name here
        </Box>
        <Box sx={{
            display:'flex',alignItems:'center',justifyContent:'space-between',padding:'5px 20px',
        }}>
            Filters here
            <Link to="add">
                <IconButton style={{backgroundColor:"#D8E6FC",boxShadow:'2px 3px 8px 1px #888888'}} aria-label="delete" size="large">
                    <AddIcon style={{width:"50px",height:"50px"}} fontSize="large" />
                </IconButton>
            </Link>
        </Box>
        <ScrollableDiv height="600px">
            <TableContainer component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{backgroundColor:"#D8E6FC",}}>
                <TableRow>
                <TableCell><b>University Name</b></TableCell>
                <TableCell align="center"><b>No of Faculties/Institutions</b></TableCell>
                <TableCell align="center"><b>District</b></TableCell>
                <TableCell align="center"><b>Type</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                        key={row.University_Name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.University_Name}
                            </TableCell>
                            <TableCell align="center">{row.No_of_Faculties}</TableCell>
                            <TableCell align="center">{row.District}</TableCell>
                            <TableCell align="center">{row.Type}</TableCell>
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

export default ViewReviewers