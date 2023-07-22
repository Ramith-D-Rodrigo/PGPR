import React from 'react';
import ScrollableDiv from './ScrollableDiv';
import Card from './DashboardCard';
import { Grid } from '@mui/material';

const Dashboard = ({contents}) => {
  return (
    <>
      <ScrollableDiv height="600px">
        <Grid container rowSpacing={1}  justifyContent="start" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    
                    {/* {contents && contents.map((content) => (
                        <Grid item>

                        <Card
                        title={content.title}     
                        content={content.content}
                        message={content.message}
                        />
                        </Grid>
                    ))} */}
                     
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
    </>
  )
}

export default Dashboard