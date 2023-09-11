import * as React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../../api/api.js';

const SelfEvaluationReport = () => {
  useSetUserNavigations([
    {
      name: 'Self Evaluation Report',
      link: '/Self Evaluation Report',
    },
  ]);
  const rawData = {
    university: "University of Colombo",
    faculty: "University of Colombo School of Computing",
    pgprId: "PGPR-123",
    pgprName: "MSc",
    startDate: "2023-08-09",
    slqfLevel: "5",
    coordinator: "Dr.Samantha",
  };

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Simulating data fetching
    const mockData = [
      {
        criteria: 'Programme Management',
        submittedStandards: 'X1/27',
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria: 'P.Design and Development',
        submittedStandards: 'X2/12',
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria:  'Human Physical Res.LS',
        submittedStandards: 'X3/24', 
        evidences: [['X11'], ['X12'], ['X13'], ['X14'], ['X15']],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria:   'Teaching and Learning Research',   
        submittedStandards: 'X4/15', 
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria:    'Programme Evaluation',      
        submittedStandards: 'X5/25', 
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria:     'Student Assessments and Awards',        
        submittedStandards: 'X6/12', 
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
      {
        criteria:     'Student Assessments and Awards',        
        submittedStandards: 'X6/12', 
        evidences: ['X11', 'X12', 'X13', 'X14', 'X15'],
        actions: ['View', 'Edit', 'Delete'],
      },
    ];

    setTableData(mockData);
  }, []);

  return (
    <>
       
      <div>
        {/* Render raw data */}
        <div>
          <label htmlFor="university" className="block font-medium center text-gray-2000">
            University Name: {rawData.university}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Faculty/Institute: {rawData.faculty}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            PGPR ID: {rawData.pgprId}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            PGPR Name: {rawData.pgprName}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Application Start Date: {rawData.startDate}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            SLQF Level: {rawData.slqfLevel}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Programme Coordinator: {rawData.coordinator}
          </label>
        </div>
      </div>
      <ScrollableDiv height="600px">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: '#D8E6FC' }}>
              <TableRow>
                <TableCell>
                  <b>Criteria</b>
                </TableCell>
                <TableCell align="center">
                  <b>Submitted Standards</b>
                </TableCell>
                <TableCell align="center">
                  <b>Evidences</b>
                  <TableCell align="center">
                  <b>Y1</b>
                  </TableCell>
                  <TableCell align="center">
                  <b>Y2</b>
                  </TableCell>
                  <TableCell align="center">
                  <b>Y3</b>
                  </TableCell>
                  <TableCell align="center">
                  <b>Y4</b>
                  </TableCell>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.criteria}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.criteria}
                  </TableCell>
                  <TableCell align="center">
                    {row.submittedStandards}
                  </TableCell>
                  <TableCell align="center">
                    {row.evidences.join(', ')}
                  </TableCell>
                  <TableCell align="center">
                    <Button variant="outlined" color="primary" size="small">
                      View
                    </Button>
                    <Button variant="outlined" color="primary" size="small">
                      Edit
                    </Button>
                    <Button variant="outlined" color="secondary" size="small">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ScrollableDiv>
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        <Button variant="contained" color="error" style={{ marginRight: '10px' }}>
          Save and Finish Later
        </Button>
        <Button variant="contained" color="error">
          Submit
        </Button>
      </div>
    </>
  );
};

export default SelfEvaluationReport;
