import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import DrawerHeader from './DrawerHeader';

let drawerWidth = 240; //default


const SideDrawer = ({drawerOpen, drawerCloseHandler, drawerWidthInput}) => {
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
          <DrawerHeader>
            <Avatar/>
            <IconButton onClick={drawerCloseHandler}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
        </Drawer>
    );
}

export default SideDrawer;