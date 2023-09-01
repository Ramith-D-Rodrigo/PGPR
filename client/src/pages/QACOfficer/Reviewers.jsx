import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const Reviewers = () => {
  return (
    <>
        <h1>Reviewers</h1>
        <Button>
            <Link to="/qac_officer/reviewers/import">Import Reviewers</Link>
        </Button>
    </>
  )
}

export default Reviewers