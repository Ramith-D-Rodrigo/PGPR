import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Input, Typography, Button } from '@mui/material';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const TextFieldStyle = {
    width:"30%",
    margin:"20px 0"
}

const AddDean = () => {

    const [gender, setGender] = React.useState('');
    const [designation,serDesignation] = React.useState('');
    const [faculty,setFaculty] = React.useState('');

    const handleChange = (event) => {
        setGender(event.target.value);
      };    

  return (
    <form onSubmit={(e)=>e.preventDefault()} >

        <Divider variant="middle" >
            Official Details
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="designationId">Designation*</InputLabel>
                <Select
                    labelId="designationLabel"
                    id="designationSelect"
                    value={designation}
                    label="designation*"
                    onChange={handleChange}
                    required
                >
                <MenuItem value={"Director"}>Director</MenuItem>
                <MenuItem value={"Dean"}>Dean</MenuItem>
                </Select>
            </FormControl>

            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="FaultyId">Faculty*</InputLabel>
                <Select
                    labelId="facultyLabel"
                    id="facultySelect"
                    value={faculty}
                    label="faculty*"
                    onChange={handleChange}
                    required
                >
                    {/* {get data of all faculties and map to menues} */}
                <MenuItem value={"Director"}>Director</MenuItem>
                <MenuItem value={"Dean"}>Dean</MenuItem>
                </Select>
            </FormControl>

            <TextField
                type="date"
                style={TextFieldStyle}
                id = "assignedDateId"
                value={"1990-01-01"}
                label = "Assigned Date*"
                helperText = "select a date"
            />

            <TextField
                style={TextFieldStyle}
                id="officialTelephone"
                label="Official Telephone Number"
                helperText="ex: 0111234567"
                required
            />

            <TextField
                type="email"
                style={TextFieldStyle}
                id="officialEmail"
                label="Official Email"
                helperText="ex: JohnDoeofficial@example.com"
                required
            />

            <TextField
                type="url"
                style={TextFieldStyle}
                id= "googleScholarLinkID"
                label="Google Scholar Link"
                helperText="ex: https://googleScholar/perera.s.d.s.d/profile"
                required
            />

            <FormControl style={TextFieldStyle} fullWidth>
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>CV pdf</Typography>
                <Input
                    
                    id="cv"
                    type="file"
                    label="cv"
                    // required
                />
            </FormControl>

            <TextField
                multiline
                maxRows={4}
                style={TextFieldStyle}
                id="industryexperiences"
                label="Experiences in Industry"
                helperText = "briefly explain. remaining:400 words"
            />
        </Box>

        <Divider variant="middle" >
            General Details
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

            <TextField
                style={TextFieldStyle}
                id="surname"
                label="Surname"
                helperText="ex: John"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="initials"
                label="Initials"
                helperText="ex: A.B.C"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="fullname"
                label="Full Name"
                helperText="ex: John Doe"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="contact"
                label="Contact Number"
                helperText="ex: 0712345678"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="personalEmail"
                label="Personal Email"
                helperText="ex: JohnDoe@example.com"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="NIC"
                label="National Identity Card Number"
                helperText="ex: 123456789V / 123456789123"
                required
            />
            
            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="genderId">gender*</InputLabel>
                <Select
                    labelId="genderLabel"
                    id="genderSelect"
                    value={gender}
                    label="gender*"
                    onChange={handleChange}
                    required
                >
                <MenuItem value={"m"}>Male</MenuItem>
                <MenuItem value={"f"}>Female</MenuItem>
                </Select>
            </FormControl>

            {/* <TextField
                type="file"
                style={TextFieldStyle}
                id = "profilepictureId"
                value={File}
                label = "profile picture"
                helperText = ".png,.jpeg,.jpg"
                required
            /> */}

            <FormControl style={TextFieldStyle} fullWidth>
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>Profile Picture</Typography>
                <Input
                    
                    id="profilePicture"
                    type="file"
                    label="Profile Picture"
                    required
                />
            </FormControl>

        </Box>

        <Divider variant="middle" >
            Department Details (Optional)
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

            <TextField
                style={TextFieldStyle}
                id = "departmentName"
                label = "Department Name"
                helperText = "ex: Department of Computer Science"
            />

            <TextField
                style={TextFieldStyle}
                id = "depHeadName"
                label = "Department Head Name"
                helperText = "ex: Dr.Hans dopez"
            />

            <TextField
                style={TextFieldStyle}
                id = "depHeadEmail"
                label = "Department Head Email"
                helperText = "hansdopez@example.com"
            />

            <TextField
                style={TextFieldStyle}
                id = "depPostalAddress"
                label = "Department Postal Address"
                helperText = "ex: Department of Computer Science, University of Colombo, Colombo 07"
            />
        
        </Box>

        <Divider variant="middle" >
            Qualifications
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>
            <Box sx={{display:'flex',width:"100%",justifyContent:"flex-end"}} >
                <Button variant='outlined' color="success">
                add more qualifications
                </Button>
            </Box> 
            
            {/* map from all requested qualification. min:1 */}
            <Box style={TextFieldStyle}>
                <TextField
                    style={{width:"100%"}}
                    id="Qualification"
                    label="Qualification"
                    helperText = "degree/post degree/deploma/ certificate"
                />
                <TextField
                    style={{width:"100%"}}
                    id="slqfLevelId"
                    label="SLQF level"
                    helperText = "SLQF level of above mentioned qualification"
                />
                <RemoveCircleOutlineIcon style={{cursor:'pointer',color:'red',margin:'0 0 0 10px'}}/>
            </Box>
        </Box>
        
        <Box sx={{width:"100%",padding:"2rem 0"}}>
            <Button fullWidth type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    

    </form>
  )
}

export default AddDean
