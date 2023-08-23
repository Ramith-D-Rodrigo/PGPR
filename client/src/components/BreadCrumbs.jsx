import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserNavigationsContext from '../contexts/UserNavigationsProvider';
import useDrawerState from '../hooks/useDrawerState';
import HomeIcon from '@mui/icons-material/Home';

const BreadCrumbs = () => {
  
  const { userNavigations } = useContext(UserNavigationsContext);
  const { drawerState } = useDrawerState();

  return (
    <>
    
    <Breadcrumbs aria-label='breadcrumb' sx={{flexGrow: 1}} separator='&#x27A4;'>
        {userNavigations.map((location, index) => {
          if (drawerState.open && index===0) {
            return (
              index==0 && <Link key={index} style={{display: 'flex', alignItems: 'center'}} to={location.link}><HomeIcon titleAccess={location.name} sx={{ mr: 1 }} fontSize="medium" /></Link>
            )
          } else {
              return (
                <Link style={{color:"black",display: 'flex', alignItems: 'center'}} key={index} to={location.link}>{location.name}</Link>
              )
          }
        })}
    </Breadcrumbs>
    </>
  )
}

export default BreadCrumbs