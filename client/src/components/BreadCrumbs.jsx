import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import UserNavigationsContext from '../contexts/UserNavigationsProvider';

const BreadCrumbs = () => {
  
  const { userNavigations } = useContext(UserNavigationsContext);

  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{flexGrow: 1}} separator='&#x27A4;'>
        {userNavigations.map((location, index) => {
            return (
                <Link key={index} to={location.link}>{location.name}</Link>
            )
        })}
    </Breadcrumbs>
  )
}

export default BreadCrumbs