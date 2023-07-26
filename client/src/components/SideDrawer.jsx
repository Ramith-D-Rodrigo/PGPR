import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Typography } from '@mui/material';
import DrawerHeader from './DrawerHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {Link, useNavigate} from 'react-router-dom';
import useAuth from "../hooks/useAuth.js";
import axios from "../api/api.js";

let drawerWidth = 240;


const SideDrawer = ({ drawerOpen, drawerCloseHandler, drawerWidthInput }) => {
  const { auth, setAuth } = useAuth();
  const [userRole, setUserRole] = useState(auth?.authRole[0]);
  const navigate = useNavigate();

  async function handleLogout() {

    // get the csrf-cookie
    try {
      axios.get("/sanctum/csrf-cookie");
      let response = await axios.post("/logout");
      console.log(response?.status);
      setAuth(null);
      navigate("/login");
    } catch (error) {
      if (!error?.response) {
        console.log("No Server Response");
      } else {
        console.log(error?.response);
      }
    }
  }

  drawerWidth = drawerWidthInput;

    const handleClickLink = (Selectedid)=>{
      let selected = document.getElementById("listitem"+Selectedid);
      // console.log(selected);
      selected.style.backgroundColor = "#D8E6FC";
    }

    // const selectedStyle = {backgroundColor:'#D8E6FC'};

    //Demo routes for side drawer
    //fetch from backend using loged in user type
    const reviewerRoutes = [
      {route:"DashBoard",link: "/reviewer/dashboard"},
      {route:"PG Assignment" ,link: "/reviewer/viewser"},
      {route:"Set Date" ,link: "/reviewerchair/SetDate"},
      {route:"Set Criteria" ,link: "/reviewerchair/SetCriteria"},
    ]

    const qacDirectorRoutes = [
      {route:"DashBoard",link: "/qac_director/dashboard"},
      {route:"Add PG Program" ,link: "/qac_director/AddPGProgramPage"},
      {route:"Add Accounts" ,link: "/qac_director/AddAccounts"},
    ]

    const qacOfficerRoutes = [
      {route:"DashBoard",link: "/qac_officer/dashboard"},
      {route:"Universities" ,link: "/qac_officer/universities"},
      //{route:"Import Reviewers" ,link: "/qac_officer/importreviewers"},
  ]

    const cqaDirectorRoutes = [
      {route:"DashBoard",link: "/"},
      {route:"Add PG Program" ,link: "/cqa_director/AddPGProgramPage"},
      {route:"Add Accounts" ,link: "/cqa_director/AddAccounts"},
      {route:"Edit PG Program" ,link: "/cqa_director/EditPGProgram"},
    ]

    const deanDirectorRoutes = [
      {route:"DashBoard",link: "/"},
      {route:"Submit Intent Letter" ,link: "/dean/SubmitIntent"},
      {route:"Submit Consent" ,link: "/dean/SubmitConsent"},
    ]

    const iqauDirectorRoutes = [
      {route:"DashBoard",link: "/"},
    ]

    const programmeCoordinatorRoutes = [
      {route:"DashBoard",link: "/"},
    ]

    const viceChancellorRoutes = [
      {route:"DashBoard",link: "/"},
    ]

    // auth?.authRole && setUserRole(auth?.authRole);

    let userRoutes = [];
    
    // console.log("userRole",userRole);
    switch (userRole) {
      case "reviewer":
        userRoutes = reviewerRoutes;
        break;
      case "qac_director":
        userRoutes = qacDirectorRoutes;
        break;
      case "qac_officer":
        userRoutes = qacOfficerRoutes;
        break;
      case "cqa_director":
        userRoutes = cqaDirectorRoutes;
        break;
      case "dean":
        userRoutes = deanDirectorRoutes;
        break;
      case "iqau_director":
        userRoutes = iqauDirectorRoutes;
        break;
      case "programme_coordinator":
        userRoutes = programmeCoordinatorRoutes;
        break;
      case "vice_chancellor":
        userRoutes = viceChancellorRoutes;
        break;
      default:
        userRoutes = [];
        break;
    }
    // console.log("userRoutes",userRoutes);
    


    return (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
            boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
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
          {/* {console.log("userRoutes",userRoutes)} */}
          {/*userRoutes*/} {/* routes according to the user role */}
          <List component="nav" aria-label="mailbox folders">

            {
              userRoutes && userRoutes.map((route,index)=>{
                return(
                  <Link to={route.link} onClick={() => {handleClickLink(index)}} key={index}>
                    <ListItem id={"listitem"+index} className='Listitem' button divider>
                        <ListItemText primary={route.route} />
                    </ListItem>
                  </Link>
                )
              })
            }
            
          </List>

          <Link onClick={handleLogout}>
            <IconButton sx={{
            position:"fixed",width:"fit-content",left:"0px",bottom:"10px",
            }}
            >
                <LogoutIcon
                titleAccess='Log Out'
                sx={{width:35,height:35,}}
                />
                <Typography gutterBottom variant='body1' component='div'>
                  Log Out
                </Typography>
            </IconButton>
          </Link>
        </Drawer>
    );
}

export default SideDrawer;
