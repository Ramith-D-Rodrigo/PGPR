import React from 'react'
import NavigationBar from './NavigationBar'
import SideDrawer from './SideDrawer'
import MainContent from './MainContent';
import Box from '@mui/material/Box';
import { PropTypes } from 'prop-types';
import {UserNavigationsProvider} from '../contexts/UserNavigationsProvider';

const MainLayout = ({navigationBreadCrumbs,}) => {

    MainLayout.propTypes = {
        navigationBreadCrumbs: PropTypes.array.isRequired,
        // sideDrawerRoutes: PropTypes.array.isRequired,
    };
    
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    let drawerWidth = 240; //drawer width in pixel

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
      };
  
      const handleDrawerClose = () => {
        setDrawerOpen(false);
      };

    return (
      <>
      {/* {console.log("sideDrawerRoutes",sideDrawerRoutes)} */}
      <UserNavigationsProvider>
        <Box sx={{display: 'flex'}}>
            <NavigationBar open={drawerOpen} openDrawer={handleDrawerOpen} drawerWidthInput={drawerWidth} />
            <SideDrawer drawerOpen={drawerOpen} drawerCloseHandler={handleDrawerClose} drawerWidthInput={drawerWidth}/>
            <MainContent open={drawerOpen} drawerWidthInput={drawerWidth} />
        </Box>
      </UserNavigationsProvider>
      </>

    )
}

export default MainLayout