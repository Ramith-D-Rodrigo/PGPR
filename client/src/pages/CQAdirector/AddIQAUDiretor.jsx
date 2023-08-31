import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Input, Typography, Button } from '@mui/material';
import Divider from '@mui/material/Divider';

const TextFieldStyle = {
  width:"30%",
  margin:"20px 0"
}

const handleSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  let formData = new FormData(form);

  console.log(formData);

  for (const [key,value] of formData.entries()){
      console.log(`Key: ${key}, Value: ${value}`);
  }
}

function AddIQAUDiretor() {

    const [faculty,setFaculty] = useState('');
    const [gender,setGender]=useState('');
    const [profilePicture,setProfilePicture] = useState(null);
    const [cv,setCV] = useState(null);
    const [assignedDate, setAssignedDate] = useState(new Date().getFullYear().toString()+"-01-01");

    return (
      <form onSubmit={handleSubmit} >

        <Divider variant="middle" >
            Official Details
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="FaultyId">Faculty*</InputLabel>
                <Select
                    labelId="facultyLabel"
                    id="facultySelect"
                    label="faculty*"
                    name="facultyid"
                    value={faculty}
                    onChange={(e)=>setFaculty(e.target.value)}
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
                name="assignedDate"
                value={assignedDate}
                label = "Assigned Date*"
                onChange= {(e)=> setAssignedDate(e.target.value)}
                helperText = "select a date"
            />

            <TextField
                style={TextFieldStyle}
                id="officialTelephone"
                label="Official Telephone Number"
                name="officialTelephoneNo"
                helperText="ex: 0111234567"
                required
            />

            <TextField
                type="email"
                style={TextFieldStyle}
                id="officialEmail"
                name="officialEmail"
                label="Official Email"
                helperText="ex: JohnDoeofficial@example.com"
                required
            />

            <FormControl style={TextFieldStyle} fullWidth>
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>CV pdf</Typography>
                <Input
                    
                    id="cv"
                    type="file"
                    name="cv"
                    onChange={(e)=>setCV(e.target.files[0])}
                    label="cv"
                    // required
                />
            </FormControl>
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
                name="surname"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="initials"
                label="Initials"
                helperText="ex: A.B.C"
                name="initials"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="fullname"
                label="Full Name"
                helperText="ex: John Doe"
                name="fullName"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="contact"
                label="Contact Number"
                helperText="ex: 0712345678"
                name="contactNo"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="personalEmail"
                label="Personal Email"
                helperText="ex: JohnDoe@example.com"
                name="personalEmail"
                required
            />

            <TextField
                style={TextFieldStyle}
                id="NIC"
                label="National Identity Card Number"
                helperText="ex: 123456789V / 123456789123"
                name="nic"
                required
            />
            
            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="genderId">gender*</InputLabel>
                <Select
                    labelId="genderLabel"
                    id="genderSelect"
                    label="gender*"
                    name="gender"
                    value={gender}
                    onChange={(e)=>setGender(e.target.value)}
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
            /> */}

            <FormControl style={TextFieldStyle} fullWidth>
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>Profile Picture</Typography>
                <Input
                    
                    id="profilePicture"
                    type="file"
                    name="profilePic"
                    label="Profile Picture"
                    onChange={(e)=>setProfilePicture(e.target.files[0])}
                />
            </FormControl>

        </Box>
        
        <Box sx={{width:"100%",padding:"2rem 0"}}>
            <Button fullWidth type="submit" variant="contained" color="primary">
                Submit
            </Button>
        </Box>
    

      </form>
    )
}

export default AddIQAUDiretor