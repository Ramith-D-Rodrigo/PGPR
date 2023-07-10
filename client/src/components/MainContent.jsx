import { styled, useTheme } from '@mui/material/styles';
import DrawerHeader from './DrawerHeader';
import { Typography } from '@mui/material';
import Footer from './Footer';
import Box from '@mui/material/Box';
import Card from './DashboardCard';

let drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      height: '90%',
      padding: theme.spacing(3),
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
        marginLeft: 0,
      }),
    }),
  );

const MainContent = ({open, drawerWidthInput, content}) => {
    drawerWidth = drawerWidthInput;
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', minHeight:'100vh',}}>  
            <Main open={open}>
                <DrawerHeader/>
                {content} {/* content according to the page */}
                <Card 
                  title={'Requested Applications'}
                  content={'2023 Mar 30 - 2023 Jult 30'}
                  message={'Ends in 4 Days'}
                />
                <Card 
                  title={'Requested Applications'}
                  content={'2023 Mar 30 - 2023 Jult 30'}
                  message={'Ends in 4 Days'}
                />
            </Main>         
            <Footer drawerOpen={open} drawerWidthInput={drawerWidthInput}/>
        </Box>

    )
}

export default MainContent