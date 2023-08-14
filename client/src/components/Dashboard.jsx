import React from 'react';
import ScrollableDiv from './ScrollableDiv';
import Card from './DashboardCard';
import { Grid } from '@mui/material';
import useSetUserNavigations from '../hooks/useSetUserNavigations';

//set page navigations
/*
 * * all pages should do this
*/
const Dashboard = ({contents}) => {
  useSetUserNavigations(
    [
      {
        name: "Dashboard",
        link: "/dashboard"
      },
    ] 
  );
    
  return (
    <>
      <ScrollableDiv height="600px">
        <Grid container rowSpacing={6}  justifyContent="start" columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                    
                    {contents && contents.map((content,index) => (
                        <Grid key={index} item>

                        <Card
                        title={content.title}     
                        content={content.content}
                        message={content.message}
                        />
                        </Grid>
                    ))}

                    {!contents &&
                    <>
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
                    </>
                    }
                    
        </Grid>
      </ScrollableDiv>
    </>
  )
}

export default Dashboard