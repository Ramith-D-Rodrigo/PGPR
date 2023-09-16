import {Toolbar, Typography} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import {Stack, Avatar} from '@mui/material';
import BreadCrumbs from './BreadCrumbs';
import {Divider} from '@mui/material';
import styled from '@mui/material/styles/styled';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import useAuth from '../hooks/useAuth';
import { Link,useLocation, Navigate } from 'react-router-dom';
import { SERVER_URL } from '../assets/constants';

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
  boxShadow: !open? "0px 2px 1px -1px rgba(0,0,0,0.2)" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
}));

//open and openDrawer are for sidebar (navigation bar is a child of sidebar)
const NavigationBar = ({open , openDrawer, drawerWidthInput, breadCrumbs}) => {
  const {auth} = useAuth();
  const location = useLocation();
  if(!auth)
  {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  console.log("Auth :",auth);
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
              <BreadCrumbs/>{/* breadcrumbs according to the page */}
              <Stack sx={{ justifyContent: "center", alignItems:"center" }} direction='row' spacing={2}>
                  <NotificationsIcon/>
                  <Typography variant='h6' color='black'>
                      {auth.surname + " " + auth.initials}
                  </Typography>
                  <Divider orientation='vertical' flexItem color='black'/>
                  <Link to={`/${auth.authRole[0]}/profile`}>
                    <Avatar
                      alt={auth.fullName}
                      src={SERVER_URL.slice(0, -1) + auth.profilePic}
                    />
                  </Link>
              </Stack>
          </Toolbar>
      </AppBar>
  )
}

export default NavigationBar