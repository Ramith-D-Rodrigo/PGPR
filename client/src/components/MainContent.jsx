import { styled } from '@mui/material/styles';
import DrawerHeader from './DrawerHeader';
import ScrollableDiv from './ScrollableDiv';
import DiscriptiveDiv from './DiscriptiveDiv';
import { Grid } from '@mui/material';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Card from './DashboardCard';
import { useState } from 'react';
import { PropTypes } from 'prop-types';

let drawerWidth = 240;
let descriptionWidth = 30;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      padding: theme.spacing(2),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        margin: "80px 15px 15px 15px",
        borderRadius:5,
      }),
      backgroundColor:'white',
      height: open? '90%' : '100%',
      boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    }),
  );

const MainContent = ({open, drawerWidthInput, content}) => {

  MainContent.propTypes = {
    open: PropTypes.bool.isRequired,
    drawerWidthInput: PropTypes.number.isRequired,
    content: PropTypes.element.isRequired,
  };

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
  }
    drawerWidth = drawerWidthInput;
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', minHeight:'100vh',}}>  
            <Main open={open}>
                {!open && <DrawerHeader/>}
                {content} {/* content according to the page */}
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
{/* {              

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
} */}
            </Main>         
            <Footer drawerOpen={open} drawerWidthInput={drawerWidthInput}/>
        </Box>

    )
}

export default MainContent