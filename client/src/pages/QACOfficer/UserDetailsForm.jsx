import React from 'react'
import FormField from '../../components/FormField'
import { Button, ButtonBase } from '@mui/material'
import axios from '../../api/api.js'
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants'
import { Box, CircularProgress, Divider, Typography } from '@mui/material'

const UserDetailsForm = ({Loading,roleFieldsComponent}) => {

    const formFields = [
        {label: "Full Name", type: "text", name: "fullName", required:true},
        {label: "Initials" , type: "text", name: "initials",required:true},
        {label: "Surname", type: "text", name: "surname", required:true},
        {label: "Gender", type: "radio", name: "gender", options: [
            {label: "Male", name: "male", value: "m"},
            {label: "Female", name: "female", value: "f"},
        ], required:true},
        {label: "Contact Numbers", type: "text", name: "contactNo", required:true},
        {label: "Profile Picture", type: "file", name: "profilePic", required:true},
        {label: "Official Telephone Number", type: "text", name: "officialTelephoneNo", required:true},
        {label: "NIC Number", type: "text", name: "nic", required:true},
        {label: "Official Email Address", type: "email", name: "officialEmail", required:true},
        {label: "Personal Email Address", type: "email", name: "personalEmail", required:true},

    ]

    const [universities, setUniversities] = React.useState([]);

    React.useEffect(() => {
        const getUniversities = async () => {
            const response = await axios.get(`${SERVER_URL}${SERVER_API_VERSION}universities`);
            setUniversities(response.data.data);
        }
        getUniversities();
        // console.log(universities.viceChancellorId);
        // console.log(universities.qualityAssuranceCouncilDirectorId);
    }, []);


  return (
    <>
        <Box sx={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",minHeight:"60vh"}}>
            {formFields.map((field, index) => (
                <FormField required={field.required} key={index} label={field.label} type={field.type} name={field.name} options={field.options} isReadonly={field.isReadOnly}/>
            ))}
            <FormField required={true} label="University" type="select" name="universityId" options={universities.map((university) => ({label: university.name, value: university.id, name: university.name}))}/>
            {roleFieldsComponent}
        </Box>
        <Button variant="contained" color="primary" sx={{width: "100%",margin:"1rem 0 0"}} type="submit">
            {Loading ? "Creating Account..." : "Create Account"}
            {Loading ? <CircularProgress style={{color:"white",margin:"0 0.5rem"}} size={24}/> : <></>}
        </Button>
    </>
  )
}

export default UserDetailsForm