import { Box, Divider } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Button, Typography } from '@mui/material';

const ViewPGPR = () => {
    const { pgprId, serId } = useParams();

    const [pgpr, setPgpr] = useState(null);

    useEffect(() => {
        const pgprResults = async () => {
            try{
                const pgprResults = await getPGPR(pgprId);

                if(pgprResults.status){
                    setPgpr(pgprResults.data.data);
                    console.log(pgprResults.data.data);
                }
            
            }
            catch(error){
                console.log(error);
            }

        }
        pgprResults();
    }, []);

    //we have to get the final report separately

    const secondaryBoxStyle = {display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width:'50%', mt: 2};

    return (
        <>
            <Typography variant="h5" align='center'>
                Details of Post Graduate Program Review
            </Typography>

            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'row', mt: 2}}>
                <Box sx={{...secondaryBoxStyle,borderRight:"1px solid black"}}>

                    <Divider><strong>General Details</strong></Divider>
                    <Typography variant="h6" align='center'>
                        sefsfd
                    </Typography>
                    <Typography variant="h6" align='center'>
                        sdsds
                    </Typography>
                </Box>
                <Box sx={{...secondaryBoxStyle,borderLeft:"1px solid black"}}>

                    <Divider><strong>Grouped Details</strong></Divider>
                    <Typography variant="h6" align='center'>
                        sefsfd
                    </Typography>
                    <Typography variant="h6" align='center'>
                        sdsds
                    </Typography>

                    <Divider><strong>Review Team</strong></Divider>
                    <Typography variant="h6" align='center'>
                        sefsfd
                    </Typography>
                    <Typography variant="h6" align='center'>
                        sdsds
                    </Typography>

                    <Divider><strong>Evaluation</strong></Divider>
                    <Typography variant="h6" align='center'>
                        sefsfd
                    </Typography>
                    <Typography variant="h6" align='center'>
                        sdsds
                    </Typography>
                </Box>
            </Box>


            


        
        </>
    )
}

export default ViewPGPR