import { styled } from '@mui/material/styles';
import DrawerHeader from './DrawerHeader';
import Footer from './Footer';
import Box from '@mui/material/Box';
import { Outlet } from "react-router-dom";

import { PropTypes } from 'prop-types';

let drawerWidth = 240;

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
        margin: "80px 15px 10px 15px",
        borderRadius:5,
      }),
      backgroundColor:'white',
      // height: open? '92%' : '95%',
      height: '100%',
      overflowY:'auto',
      boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    }),
  );

const MainContent = ({open, drawerWidthInput}) => {

    MainContent.propTypes = {
      open: PropTypes.bool.isRequired,
      drawerWidthInput: PropTypes.number.isRequired,
      // content
      // content: PropTypes.element.isRequired,
    };

    drawerWidth = drawerWidthInput;
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', position: 'relative', minHeight:'100vh',maxHeight:'100vh',}}>
          {!open && <DrawerHeader/>} 
            <Main open={open} style={{position:'relative'}}>

                {/* {content} content according to the page */}
                <Outlet />

            </Main>         
            <Footer drawerOpen={open} drawerWidthInput={drawerWidthInput}/>
        </Box>

    )
}

export default MainContent;