import { styled, useTheme } from '@mui/material/styles';
import DrawerHeader from './DrawerHeader';
import { Typography } from '@mui/material';
import Footer from './Footer';
import Box from '@mui/material/Box';

let drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
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
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', position: 'relative'}}>  
            <Main open={open}>
                <DrawerHeader/>
                <Typography>
                    ashjdga jhahjs dgajhs gdjha ghjd
                </Typography>
            </Main>         
            <Footer drawerOpen={open} drawerWidthInput={drawerWidthInput}/>
        </Box>

    )
}

export default MainContent