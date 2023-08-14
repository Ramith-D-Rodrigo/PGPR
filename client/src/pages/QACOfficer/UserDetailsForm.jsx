import React from 'react'
import FormField from '../../components/FormField'
import { Button, ButtonBase } from '@mui/material'
import axios from '../../api/api.js'
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants'

const UserDetailsForm = ({roleFieldsComponent}) => {

    const formFields = [
        {label: "Full Name", type: "text", name: "fullName"},
        {label: "Initials" , type: "text", name: "initials"},
        {label: "Surname", type: "text", name: "surname"},
        {label: "Gender", type: "radio", name: "gender", options: [
            {label: "Male", name: "male", value: "m"},
            {label: "Female", name: "female", value: "f"},
        ]},
        {label: "Contact Numbers", type: "text", name: "contactNo"},
        {label: "Profile Picture", type: "file", name: "profilePic"},
        {label: "Official Telephone Number", type: "text", name: "officialTelephoneNo"},
        {label: "NIC Number", type: "text", name: "nic"},
        {label: "Official Email Address", type: "email", name: "officialEmail"},
        {label: "Personal Email Address", type: "email", name: "personalEmail"},

    ]

    const [universities, setUniversities] = React.useState([]);

    React.useEffect(() => {
        const getUniversities = async () => {
            const response = await axios.get(`${SERVER_URL}${SERVER_API_VERSION}universities`);
            setUniversities(response.data.data);
        }
        getUniversities();
    }, []);


  return (
    <>
        {formFields.map((field, index) => (
            <FormField key={index} label={field.label} type={field.type} name={field.name} options={field.options} isReadonly={field.isReadOnly}/>
        ))}
        <FormField label="University" type="select" name="universityId" options={universities.map((university) => ({label: university.name, value: university.id, name: university.name}))}/>
        {roleFieldsComponent}
        <Button variant="contained" color="primary" sx={{width: "100%"}} type="submit">Create Account</Button>
    </>
  )
}

export default UserDetailsForm