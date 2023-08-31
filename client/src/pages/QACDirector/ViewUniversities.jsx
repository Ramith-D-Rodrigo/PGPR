// import axios from 'axios';
import * as React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import { styled } from '@mui/material/styles';
import {CircularProgress, Typography} from '@mui/material';
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
import { useEffect, useState } from 'react';
import getAllUniversities from '../../api/University/getAllUniversities';

const ViewUniversities = () => {
    useSetUserNavigations(
      [
          {
            name: "Universities",
            link: "/universities"
          },
      ]
    );
    const [loading, setLoading] = useState(false);

    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        document.title = 'View Universities | QAC'

        async function getUniversities() {
            setLoading(true);

            try{
                const result = await getAllUniversities();
                setUniversities(result.data.data);
            }
            catch(err){
                console.log(err.response.data);
            }

            setLoading(false);
        }

        getUniversities();
    }, []);

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

    // const tableData = [
    //     { id: 1, column1Data: 'Data 1', column2Data: 'Data 2' },
    //     { id: 2, column1Data: 'Data 3', column2Data: 'Data 4' },
    // ];
    // console.log(rows);

    const actions = [
        {action:'View',allow:true},
        {action:'Edit',allow:true},
        {action:'Delete',allow:true},
    ]

    return (
        <>
        {loading &&
            <div style={{display:"flex",width:"100%",justifyContent:"center",alignItems:"center"}}> 
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
            <Link to="add">
                <Button variant="contained" style={{margin:"2rem 0 0",boxShadow:'2px 3px 8px 1px #888888'}}>Add University</Button>
            </Link>
        </Box>
        
        <TableContainer style={{margin:"1rem 0"}} component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{backgroundColor:"#D8E6FC",}}>
                <TableRow>
                <TableCell><b>University Name</b></TableCell>
                <TableCell align="center"><b>Address</b></TableCell>
                <TableCell align="center"><b>Website</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {universities.map((row) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.address}</TableCell>
                            <TableCell align="center">{row.website}</TableCell>
                            <TableCell align="center">
                                <Link key={row.name + 'view'} to={'view/'+row.id}>
                                    <Button style={{margin:"0 8px"}} variant="contained" color="primary" size="small">View</Button>
                                </Link>
                                <Link key={row.name + 'edit'} to={'edit/'+row.id}>
                                    <Button style={{margin:"0 8px"}} variant="contained" color="primary" size="small">Edit</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </>
    )
}

export default ViewUniversities