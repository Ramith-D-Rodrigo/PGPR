import {AppBar, Toolbar, Typography} from '@mui/material';
import {Stack, Avatar} from '@mui/material';
import BreadCrumbs from './BreadCrumbs';
import {Divider} from '@mui/material';
import shadows from '@mui/material/styles/shadows';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const NavigationBar = () => {
  return (
    <AppBar position='static' color='transparent' style={{boxShadow: 'none'}}>
        <Toolbar>
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