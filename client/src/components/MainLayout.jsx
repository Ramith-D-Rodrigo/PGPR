import React from 'react'
import NavigationBar from './NavigationBar'
import SideDrawer from './SideDrawer'
import MainContent from './MainContent';
import Box from '@mui/material/Box';
import { PropTypes } from 'prop-types';

const MainLayout = ({navigationBreadCrumbs, sideDrawerRoutes, mainContent}) => {

    MainLayout.propTypes = {
        navigationBreadCrumbs: PropTypes.array.isRequired,
        sideDrawerRoutes: PropTypes.array.isRequired,
        mainContent: PropTypes.element.isRequired,
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
        <Box sx={{display: 'flex'}}>
            <NavigationBar open={drawerOpen} openDrawer={handleDrawerOpen} drawerWidthInput={drawerWidth} breadCrumbs={navigationBreadCrumbs} />
            <SideDrawer drawerOpen={drawerOpen} drawerCloseHandler={handleDrawerClose} drawerWidthInput={drawerWidth} routes={sideDrawerRoutes}/>
            <MainContent open={drawerOpen} drawerWidthInput={drawerWidth} content={mainContent}/>
        </Box>
      </>

    )
}

export default MainLayout