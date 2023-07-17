import { Breadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'

const BreadCrumbs = () => {
  return (
    <Breadcrumbs aria-label='breadcrumb' sx={{flexGrow: 1}} separator='&#x27A4;'>
        <Link to='/'>CQA Director</Link>
        <Link to='/'>PG Programs</Link>
    </Breadcrumbs>
  )
}

export default BreadCrumbs