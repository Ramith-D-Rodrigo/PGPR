import { styled, useTheme } from '@mui/material/styles';
import DrawerHeader from './DrawerHeader';
import { Typography, Stack } from '@mui/material';
import { Grid } from '@mui/material';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Card from './DashboardCard';

let drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      height: '90%',
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
  boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    }),
  );

const MainContent = ({open, drawerWidthInput, content}) => {
    drawerWidth = drawerWidthInput;
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', minHeight:'100vh',}}>  
            <Main open={open}>
                {!open && <DrawerHeader/>}
                {content} {/* content according to the page */}
{              
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  
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
}
            </Main>         
            <Footer drawerOpen={open} drawerWidthInput={drawerWidthInput}/>
        </Box>

    )
}

export default MainContent