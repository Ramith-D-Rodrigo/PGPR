import React from 'react';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import Card from '../../components/DashboardCard';
import { Grid } from '@mui/material';
import { useState } from 'react';

const ViewSer = () => {

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);

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

    return (
        <>
        <DiscriptiveDiv onClick={handleClick} expand={expand==8? 1:2} description="Reviewer" width='100%' height={`${expand}%`} backgroundColor="#D9D9D9" >
                    
                    </DiscriptiveDiv>
                    
                    <DiscriptiveDiv description="Desk Evaluation" width='100%' height={newHeight} backgroundColor="#D9D9D9" >
                    <ScrollableDiv width="100%" height="500px">
                    <Grid container rowSpacing={1}  justifyContent="center" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    
                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>

                    <Grid item>
                        <Card 
                        title={'Requested Applications'}
                        content={'2023 Mar 30 - 2023 Jult 30'}
                        message={'Ends in 4 Days'}
                    />
                    </Grid>
                    
                    </Grid>
                    </ScrollableDiv>
                    </DiscriptiveDiv>
                    </>
    )
}

export default ViewSer
