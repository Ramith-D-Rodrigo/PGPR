import React from 'react';
import styled from 'styled-components';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import getCoordinatorPGP from '../../api/ProgrammeCoordinator/getCoordinatorPGP';
import getPostGraduatePRogramPGPRs from '../../api/PostGraduateProgram/getPostGraduatePRogramPGPRs';
import { Button, ButtonGroup } from '@mui/material';
import { Link } from 'react-router-dom';

const PGPRs = () => {

  const [PGPRs, setPGPRs] = React.useState([]);
  const { auth } = useAuth();

  React.useEffect(() => {
    const getData = async () => {
      try{
        const pgpResponse = await getCoordinatorPGP(auth.id); 

        if (pgpResponse && pgpResponse.status === 200) {
          console.log(pgpResponse.data.data);
          const pgprResponse = await getPostGraduatePRogramPGPRs(pgpResponse.data.data.id, {includeSelfEvaluationReport: true});
  
          if (pgprResponse && pgprResponse.status === 200) {
            console.log(pgprResponse.data.data);

            const pgprData = pgprResponse.data.data;
            pgprData.ppg = pgpResponse.data.data;

            setPGPRs(pgprData);
          }
        }
      }
      catch(error){
        console.log(error);
      }
    }

    getData();
  }, [auth.id]);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PRGR ID</TableCell>
              <TableCell>PostGraduate Programme</TableCell>
              <TableCell>Is Grouped?</TableCell>
              <TableCell>Application</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {PGPRs.map((pgpr) => (
              <TableRow key={pgpr.id}>
                <TableCell>{pgpr.id}</TableCell>
                <TableCell>{PGPRs.ppg.title}</TableCell>
                <TableCell>{pgpr.groupedWith ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Button variant="contained" color="primary" size="small">View</Button>
                  </ButtonGroup>
                </TableCell>
                <TableCell>{pgpr.statusOfPgpr}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <Link to={`/programme_coordinator/pgprs/${pgpr?.selfEvaluationReport.id}`}>
                      <Button variant="contained" color="primary" size="small">View More</Button>
                    </Link>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default PGPRs