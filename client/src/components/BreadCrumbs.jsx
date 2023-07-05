import { Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'

const BreadCrumbs = () => {
  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{flexGrow: 1}} separator='>'>
        <Link to='/'>Dashboard</Link>
        <Link to='/'>Programmes</Link>
        <Link to='/'>Programme</Link>
    </Breadcrumbs>
  )
}

export default BreadCrumbs