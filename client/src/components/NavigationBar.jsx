import {Toolbar, Typography} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import {Stack, Avatar} from '@mui/material';
import BreadCrumbs from './BreadCrumbs';
import {Divider} from '@mui/material';
import styled from '@mui/material/styles/styled';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

let drawerWidth = 240; //default value

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth+30}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    margin:"5px 15px 0px 0px",
    borderRadius:5,
  }),
  backgroundColor:'white',
  boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
}));

//open and openDrawer are for sidebar (navigation bar is a child of sidebar)
const NavigationBar = ({open , openDrawer, drawerWidthInput, breadCrumbs}) => {
  drawerWidth = drawerWidthInput;
  return (
      <AppBar color='transparent' open={open} position='absolute'>
          <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick= {openDrawer}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <BreadCrumbs locations={breadCrumbs}/>{/* breadcrumbs according to the page */}
              <Stack sx={{ justifyContent: "center", alignItems:"center" }} direction='row' spacing={2}>
                  <NotificationsIcon/>
                  <Typography variant='h6' color='black'>
                      User&apos;s Name
                  </Typography>
                  <Divider orientation='vertical' flexItem color='black'/>
                  <Avatar
                    src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80'
                  />
              </Stack>
          </Toolbar>
      </AppBar>
  )
}

export default NavigationBar