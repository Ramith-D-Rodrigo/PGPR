import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAUniversity from '../../api/University/getAUniversity';
import { Button, CircularProgress, Table, Typography } from '@mui/material';
import { SERVER_URL } from '../../assets/constants';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import { TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import getCurrentDean from '../../api/Faculty/getCurrentDean';

const ViewUniversity = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const [university, setUniversity] = useState(null);

    useEffect(() => {

        document.title = 'View University | CQA'

        const handleGetUniversity = async () => {

            setLoading(true);

            try{

                const queryParams = {
                  'includeCQA' : true,
                  'includeViceChancellor' : true,
                  'includeUniversitySide' : true,
                  'includeUser' : true,
                }

                console.log(id);
                const result = await getAUniversity(id, queryParams);

                console.log(result.data.data);

                //get faculties of the university
                const facultyResult = await getUniversityFaculties(id);

                console.log(facultyResult.data.data);

                //go through each faculty and get the dean
                for(let i = 0; i < facultyResult.data.data.length; i++){
                    const faculty = facultyResult.data.data[i];

                    const deanResult = await getCurrentDean(faculty.id, { 'includeUser' : true, 'includeUniversitySide' : true , 'includeAcademicStaff' : true});

                    console.log(deanResult.data.data);

                    faculty.dean = deanResult.data.data;
                }

                result.data.data.faculties = facultyResult.data.data;

                setUniversity(result.data.data);
            }
            catch(err){
                console.log(err.response.data);
            }

            setLoading(false);
        }

        handleGetUniversity();
    }, [id]);

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
        {!loading && university &&
            <div>
                <h1>{university.name}</h1>
                <h2>{university.viceChancellor?.universitySide.user.initials + " " + university.viceChancellor?.universitySide.user.surname}</h2>
                <h1>{university.address}</h1>
                <h1>{university.website}</h1>

                <div>
                  <h1>Center For Quality Assurance</h1>
                  <h2>{JSON.stringify(university.centerForQualityAssurance.contactNo)}</h2>
                  <h2>{JSON.stringify(university.centerForQualityAssurance.faxNo)}</h2>
                  <h2>{university.centerForQualityAssurance.email}</h2>

                  <h1>Center For Quality Assurance Director</h1>

                  <h2>{university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.initials + " " + university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.surname}
                    <img src={SERVER_URL.substring(0, SERVER_URL.length - 1) + university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.profilePic} target="_blank" rel="noreferrer"/>
                  </h2>
                </div>

                <h1>Faculties</h1>

                <TableContainer>
                    <Table>
                        <TableHead >
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Faculty Code</TableCell>
                                <TableCell align="center">Current Dean</TableCell>
                                <TableCell align="center">Contact Numbers</TableCell>
                                <TableCell align="center">Fax Numbers</TableCell>
                                <TableCell align="center">Website</TableCell>
                                <TableCell align="center">IQAU</TableCell>
                            </TableRow>

                        </TableHead>
                        <TableBody>
                            {university.faculties.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.dean?.academicStaff.universitySide.user.initials + " " + row.dean?.academicStaff.universitySide.user.surname}</TableCell>
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
                                        <Link to={`/iqau/${row.id}`}>
                                            <Button>View</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        }
      </>
  )
}

export default ViewUniversity
