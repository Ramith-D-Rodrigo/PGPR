// import axios from 'axios';
// import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
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

import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import {Link} from 'react-router-dom';

const Universities = () => {

    // axios.get(SERVER_URL + SERVER_API_VERSION + '/universities')
    // .then(res => {
    //     console.log(res.data);
    // })

    // const StyledTableCell = styled(TableCell)(({ theme }) => ({
    //     [`&.${tableCellClasses.head}`]: {
    //       backgroundColor: theme.palette.common.black,
    //       color: theme.palette.common.white,
    //     },
    //     [`&.${tableCellClasses.body}`]: {
    //       fontSize: 14,
    //     },
    //   }));
      
    //   const StyledTableRow = styled(TableRow)(({ theme }) => ({
    //     '&:nth-of-type(odd)': {
    //       backgroundColor: theme.palette.action.hover,
    //     },
    //     // hide last border
    //     '&:last-child td, &:last-child th': {
    //       border: 0,
    //     },
    //   }));

    function createData(University_Name, No_of_Faculties, District, Type, Actions) {
        Actions = Actions.map((action,index) => {
            return <Button style={{margin:"0 8px"}} key={index} variant="contained" color="primary" size="small">{action}</Button>
        });
        return { University_Name, No_of_Faculties, District, Type, Actions };
    }

    const rows = [
        createData('University of Colombo', 9, 'In-review', 'Yes', ['View', 'Edit', 'Delete']),
        createData('University of Peradeniya', 12, 'In-review', 'No', ['View', 'Edit', 'Delete']),
        createData('University of Ruhuna', 9, 'In-review', 'Yes', ['View', 'Edit', 'Delete']),
        createData('University of Moratuwa', 5, 'In-review', 'No', ['View', 'Edit', 'Delete']),
        createData('NSBM', 5, 'In-review', 'Yes', ['View', 'Edit', 'Delete']),
      ];

    const tableData = [
        { id: 1, column1Data: 'Data 1', column2Data: 'Data 2' },
        { id: 2, column1Data: 'Data 3', column2Data: 'Data 4' },
    ];
    // console.log(rows);

    return (
        <>
        <Box sx={{
            display:'flex',alignItems:'center',justifyContent:'flex-end',
        }}>
            <Link to="/qacofficer/universities/add">
                <IconButton style={{backgroundColor:"#D8E6FC",boxShadow:'2px 3px 8px 1px #888888'}} aria-label="delete" size="large">
                    <AddIcon style={{width:"50px",height:"50px"}} fontSize="large" />
                </IconButton>
            </Link>
        </Box>
        <ScrollableDiv height="600px">
            <TableContainer component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{backgroundColor:"#D8E6FC"}}>
                <TableRow>
                <TableCell>University Name</TableCell>
                <TableCell align="center">No of Faculties/Institutions</TableCell>
                <TableCell align="center">District</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Actions</TableCell>
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

export default Universities