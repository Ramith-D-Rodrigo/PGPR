import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar,Typography } from '@mui/material';
import DrawerHeader from './DrawerHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

let drawerWidth = 240; //default


const SideDrawer = ({drawerOpen, drawerCloseHandler, drawerWidthInput, userRoutes}) => {
    drawerWidth = drawerWidthInput;
    return (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={drawerOpen}
        >
          <IconButton sx={{position:"fixed",width:"fit-content",left:"10px",top:"10px",}} onClick={drawerCloseHandler}>
                <MenuIcon />
          </IconButton> 
          <IconButton sx={{position:"fixed",width:"fit-content",left:`${drawerWidth-45}px`,top:"10px",}} onClick={() => {alert("Welcome to User Guide")}}>
                <HelpIcon/>
          </IconButton> 
          <DrawerHeader sx={{justifyContent:"center",padding:"10px"}}>
            <Avatar
              alt="UGC LOGO"
              sx={{width:120,height:120}}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8G70_aXsPvet0K-TvhODLgf6P8eJVQ2iL_ZsmDx5Lm9eK7C_9pWXAg3dfmtaTjad0xZM&usqp=CAU"
            />
          </DrawerHeader>

          <Divider variant="middle" color='black'/>
          
          {userRoutes} {/* routes according to the user role */}
          <List component="nav" aria-label="mailbox folders">

            {userRoutes && userRoutes.map((userRoute)=>{
              <ListItem button divider>
                <ListItemText primary={userRoute} />
              </ListItem>
            })}
            <ListItem button divider>
              <ListItemText primary="PG Assignments" />
            </ListItem>
            <ListItem button divider>
              <ListItemText primary="Drafts" />
            </ListItem>
            <ListItem button divider>
              <ListItemText primary="Trash" />
            </ListItem>
            <ListItem button divider>
              <ListItemText primary="Spam" />
            </ListItem>

          </List>

          <IconButton onClick={()=>{alert("Log Out")}}sx={{
          position:"fixed",width:"fit-content",left:"0px",bottom:"10px",
          }}
          >
              <LogoutIcon
              titleAccess='Log Out'
              sx={{width:35,height:35,}}
              />
              {/* <Typography gutterBottom variant='body1' component='div'>
                Log Out
              </Typography> */}
          </IconButton>
        </Drawer>
    );
}

export default SideDrawer;