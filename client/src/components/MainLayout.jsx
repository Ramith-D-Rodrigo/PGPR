import React from 'react'
import NavigationBar from './NavigationBar'
import SideDrawer from './SideDrawer'
import MainContent from './MainContent';
import Box from '@mui/material/Box';

const MainLayout = () => {
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
            <NavigationBar open={drawerOpen} openDrawer={handleDrawerOpen} drawerWidthInput={drawerWidth} />
            <SideDrawer drawerOpen={drawerOpen} drawerCloseHandler={handleDrawerClose} drawerWidthInput={drawerWidth}/>
            <MainContent open={drawerOpen} drawerWidthInput={drawerWidth}/>
        </Box>
      </>

    )
}

export default MainLayout