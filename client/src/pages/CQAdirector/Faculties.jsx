import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import ScrollableDiv from '../../components/ScrollableDiv';
import { styled } from '@mui/material/styles';
import {CircularProgress} from '@mui/material';
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
import { Link as ExternalLink } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../../api/api.js';

function Faculties() {
    useSetUserNavigations(
        [
            {
              name: "Faculties",
              link: "/faculties"
            },
        ]
      );

    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        document.title = "Faculties";
        
        async function getFaculties () {
            setLoading(true);
            await axios.get("/sanctum/csrf-cookie");
            await axios.get(SERVER_URL + SERVER_API_VERSION +'faculties/')
            .then(res => {
                console.log(res.data.data);
                setFaculties(res?.data?.data);
            })
            .catch(err => {
                console.log("error: ",err);
            })
            setLoading(false);
        }
    
        getFaculties();
    }, []);

    const rows = faculties.map((faculty) => {
        return {
            name: faculty.name,
            website: <ExternalLink style={{color:"darkblue"}} href={faculty.website} target="_blank" rel="noopener">{faculty.website}</ExternalLink>,
            address: faculty.address,
            Actions: <Button variant="contained" style={{boxShadow:'2px 3px 8px 1px #888888'}}><Link to={`${faculty.id}`}>View</Link></Button>
        }
    });
    
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
                    <Button variant="contained" style={{margin:"2rem 0 0",boxShadow:'2px 3px 8px 1px #888888'}}>Add Faculty</Button>
                </Link>
            </Box>
            
            <TableContainer style={{margin:"1rem 0"}} component={Paper} >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{backgroundColor:"#D8E6FC",}}>
                <TableRow>
                <TableCell><b>Faculty Name</b></TableCell>
                <TableCell align="center"><b>Faculty Official Website</b></TableCell>
                <TableCell align="center"><b>Address</b></TableCell>
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
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.website}</TableCell>
                            <TableCell align="center">{row.address}</TableCell>
                            <TableCell align="center">{row.Actions}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

      </>
    );
}

export default Faculties