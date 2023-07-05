import { Avatar, Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';

const SideDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <IconButton 
        onClick={() => setIsDrawerOpen(true)}
        edge='start'
        color='inherit'
        aria-lang="logo">
          <MenuIcon/>
      </IconButton>
      <Drawer 
        anchor='left'
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}>
          <Box p={2} textAlign={'center'} role='presentation' width={'250px'}>
              <Avatar/>
              <Divider/>

              <Typography variant='h6' color='black'>
                  Dashboard
              </Typography>
          </Box>
      </Drawer>
    </>
  )
}

export default SideDrawer