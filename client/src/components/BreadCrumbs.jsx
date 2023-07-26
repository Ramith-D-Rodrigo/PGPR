import { Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'

const BreadCrumbs = ({locations}) => {
  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{flexGrow: 1}} separator='&#x27A4;'>
        {locations.map((location, index) => {
            return (
                <Link key={index} to={location.link}>{location.name}</Link>
            )
        })}
    </Breadcrumbs>
  )
}

export default BreadCrumbs