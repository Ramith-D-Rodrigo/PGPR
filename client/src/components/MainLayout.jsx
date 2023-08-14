import React from 'react'
import NavigationBar from './NavigationBar'
import SideDrawer from './SideDrawer'
import MainContent from './MainContent';
import Box from '@mui/material/Box';
import { PropTypes } from 'prop-types';
import {UserNavigationsProvider} from '../contexts/UserNavigationsProvider';
import useDrawerState from '../hooks/useDrawerState';

const MainLayout = () => {
    const {drawerState, setDrawerState} = useDrawerState();
    // const [drawerOpen, setDrawerOpen] = React.useState(true);

    let drawerWidth = 240; //drawer width in pixel

    const handleDrawerOpen = () => {
        // setDrawerOpen(true);
        setDrawerState({open:true});
      };
  
      const handleDrawerClose = () => {
        // setDrawerOpen(false);
        setDrawerState({open:false});
      };

    return (
      <>
      {/* {console.log("sideDrawerRoutes",sideDrawerRoutes)} */}
      <UserNavigationsProvider>
        <Box sx={{display: 'flex'}}>
            <NavigationBar open={drawerState.open} openDrawer={handleDrawerOpen} drawerWidthInput={drawerWidth} />
            <SideDrawer drawerOpen={drawerState.open} drawerCloseHandler={handleDrawerClose} drawerWidthInput={drawerWidth}/>
            <MainContent open={drawerState.open} drawerWidthInput={drawerWidth} />
        </Box>
      </UserNavigationsProvider>
      </>

    )
}

export default MainLayout