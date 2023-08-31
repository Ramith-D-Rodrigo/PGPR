import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Input, Typography, Button, CircularProgress } from '@mui/material';
import Divider from '@mui/material/Divider';

const TextFieldStyle = {
  width:"30%",
  margin:"20px 0"
}

function AddIQAUDiretor({onSubmit,isLoading,faculties}) {

    const [faculty,setFaculty] = useState('');
    const [gender,setGender]=useState('');
    const [profilePicture,setProfilePicture] = useState(null);
    const [cv,setCV] = useState(null);
    const [assignedDate, setAssignedDate] = useState(new Date().getFullYear().toString()+"-01-01");

    useEffect(()=>{
        document.title="Add IQAU Director";
    },[])

    return (
    <>
      {isLoading && <Typography variant="h6" align='center' style={{margin:"2rem 0"}}>Loading ... <CircularProgress color='primary' style={{margin:"0 0.5rem"}} size={24} /></Typography>}
      <form onSubmit={onSubmit} >

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
                    disabled={isLoading}
                    required
                >
                {
                    faculties.map((faculty,index)=>{
                        return <MenuItem key={index} value={faculty.id}>{faculty.name}</MenuItem>
                    })
                }
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
                disabled={isLoading}
                helperText = "select a date"
            />

            <TextField
                style={TextFieldStyle}
                id="officialTelephone"
                label="Official Telephone Number"
                name="officialTelephoneNo"
                helperText="ex: 0111234567"
                disabled={isLoading}
                required
            />

            <TextField
                type="email"
                style={TextFieldStyle}
                id="officialEmail"
                name="officialEmail"
                label="Official Email"
                helperText="ex: JohnDoeofficial@example.com"
                disabled={isLoading}
                required
            />

            <FormControl style={TextFieldStyle} fullWidth>
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>CV pdf</Typography>
                <Input
                    
                    id="cv"
                    type="file"
                    name="cv"
                    onChange={(e)=>setCV(e.target.files[0])}
                    disabled={isLoading}
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
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id="initials"
                label="Initials"
                helperText="ex: A.B.C"
                name="initials"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id="fullname"
                label="Full Name"
                helperText="ex: John Doe"
                name="fullName"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id="contact"
                label="Contact Number"
                helperText="ex: 0712345678"
                name="contactNo"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id="personalEmail"
                label="Personal Email"
                helperText="ex: JohnDoe@example.com"
                name="personalEmail"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id="NIC"
                label="National Identity Card Number"
                helperText="ex: 123456789V / 123456789123"
                name="nic"
                disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
            </FormControl>

        </Box>
        
        <Box sx={{width:"100%",padding:"2rem 0"}}>
            <Button disabled={isLoading} fullWidth type="submit" variant="contained" color="primary">
                {isLoading? "Loading " : "Submit"}
                {isLoading && <CircularProgress color='primary' style={{margin:"0 0.5rem"}} size={24} />}
            </Button>
        </Box>
    

      </form>
    </>
    )
}

export default AddIQAUDiretor