import MainLayout from '../../components/MainLayout';
import axios from '../../api/api.js';
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Button, ButtonGroup, TableContainer, TableHead } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Universities = () => {

    const [universities, setUniversities] = useState([]);


    useEffect(() => {
        const func = async () => {
            axios.get(SERVER_URL + SERVER_API_VERSION + 'universities')
            .then(res => {
                    console.log(res.data.data);
                    setUniversities(res.data.data);
                })
                .catch(err => {
                    console.error(err.message);
                })
        }
        func();
    }, []);

    const tableHeaders = [
        'Name',
        'Code',
        'Address',
        'Contact Numbers',
        'Fax Numbers',
        'Website',
        'Vice Chancellor',
        'CQA Director',
        'Actions'
    ]

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead >
                        <TableRow>
                            {tableHeaders.map((header) => (
                                <TableCell key={header} align="center">{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {universities.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{
                                    row.contactNo['data'].map((contactNo) => (
                                    <p key={row.id + contactNo}>{contactNo}</p>
                                    ))
                                }</TableCell>
                                <TableCell>{
                                    row.faxNo['data'].map((faxNo) => (
                                    <p key={row.id + faxNo}>{faxNo}</p>
                                    ))
                                }</TableCell>
                                <TableCell>{row.website}</TableCell>

                                <TableCell>
                                    <ButtonGroup>
                                        <Button variant="contained" color="primary">View</Button>
                                        <Button variant="contained" color="primary">Edit</Button>
                                    </ButtonGroup>
                                </TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Button variant="contained" color="primary">View</Button>
                                        <Button variant="contained" color="primary">Edit</Button>
                                    </ButtonGroup>
                                </TableCell>
                                <TableCell>
                                    <ButtonGroup>
                                        <Link to={`/qac_officer/universities/view/${row.id}`}>
                                            <Button variant="contained" color="primary">View</Button>
                                        </Link>
                                        <Button variant="contained" color="primary">Edit</Button>
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

export default Universities