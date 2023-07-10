import {Toolbar, Typography} from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import {Stack, Avatar} from '@mui/material';
import BreadCrumbs from './BreadCrumbs';
import {Divider} from '@mui/material';
import styled from '@mui/material/styles/styled';
import IconButton from '@mui/material/IconButton';
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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

//open and openDrawer are for sidebar (navigation bar is a child of sidebar)
const NavigationBar = ({open , openDrawer, drawerWidthInput, breadCrumbs}) => {
  drawerWidth = drawerWidthInput;
  return (
      <AppBar color='transparent' style={{boxShadow: 'none'}} open={open} position='absolute'>
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
              {breadCrumbs} {/* breadcrumbs according to the page */}
              <BreadCrumbs/>
              <Stack direction='row' spacing={2}>
                  
                  <Typography variant='h6' color='black'>
                      User&apos;s Name
                  </Typography>
                  <Divider orientation='vertical' flexItem color='black'/>
                  <Avatar/>
              </Stack>
          </Toolbar>
      </AppBar>
  )
}

export default NavigationBar