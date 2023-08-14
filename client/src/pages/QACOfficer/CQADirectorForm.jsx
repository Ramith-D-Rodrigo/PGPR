import React from 'react'
import UserDetailsForm from './UserDetailsForm'
import FormField from '../../components/FormField'

const CQADirectorForm = () => {
  return (
    <>
        <FormField label={"Assigned Date"} type={"date"} name={"assignedDate"}/>
    </>
  )
}

export default CQADirectorForm