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

const AddDean = ({onSubmit,isLoading,faculties}) => {

    const [destination,setDestination] = useState('');
    const [faculty,setFaculty] = useState('');
    const [gender,setGender]=useState('');
    const [profilePicture,setProfilePicture] = useState(null);
    const [cv,setCV] = useState(null);
    const [assignedDate, setAssignedDate] = useState(new Date().getFullYear().toString()+"-01-01");

    useEffect(()=>{
        document.title="Add Dean";
    },[])

  return (
    <>
    {isLoading && <Typography variant="h6" align='center' style={{margin:"2rem 0"}}>Loading ... <CircularProgress color='primary' style={{margin:"0 0.5rem"}} size={24} /></Typography>}
    <form onSubmit={(evt) => onSubmit(evt)} >

        <Divider variant="middle" >
            Official Details
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

                <TextField
                    style={TextFieldStyle}
                    id= "desginationID"
                    name="designation"
                    label="Designation"
                    disabled={isLoading}
                    required
                    onChange={(e)=>setDestination(e.target.value)}
                />

            <FormControl style={TextFieldStyle} fullWidth>
                <InputLabel id="FaultyId">Faculty*</InputLabel>
                <Select
                    disabled={isLoading}
                    labelId="facultyLabel"
                    id="facultySelect"
                    label="faculty*"
                    name="facultyId"
                    value = {faculty}
                    onChange={(e)=>setFaculty(e.target.value)}
                    required
                >
                {
                    faculties.map((faculty,index)=>{
                        return <MenuItem key={index} value={faculty.id}>{faculty.name}</MenuItem>
                    })
                }
                {
                    faculties.length===0 && <MenuItem value={""}>No faculties</MenuItem>
                }
                </Select>
            </FormControl>

            <TextField
                disabled={isLoading}
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

            <TextField
                type="url"
                style={TextFieldStyle}
                id= "googleScholarLinkID"
                name="googleScholarLink"
                label="Google Scholar Link"
                helperText="ex: https://googleScholar/perera.s.d.s.d/profile"
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
                    required
                />
            </FormControl>

            <TextField
                multiline
                maxRows={4}
                style={TextFieldStyle}
                name="experienceInIndustry"
                id="industryexperiences"
                label="Experiences in Industry"
                helperText = "briefly explain. remaining:400 words"
                disabled={isLoading}
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
                <Typography variant="body2" style={{marginBottom:"5px",color:"gray"}}>Profile Picture (	&lt; 1 mb)</Typography>
                <Input
                    
                    id="profilePicture"
                    type="file"
                    name="profilePic"
                    label="Profile Picture"
                    onChange={(e)=>setProfilePicture(e.target.files[0])}
                    disabled={isLoading}
                    required
                />
            </FormControl>

        </Box>

        <Divider variant="middle" >
            Department Details (Optional)
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>

            <Box style={{display:"flex",width:"100%",justifyContent:"flex-start"}}>
                <p><strong>Note: </strong>Here refer to the department that Dean / Director has been assigned</p>
            </Box>

            <TextField
                style={TextFieldStyle}
                id = "departmentName"
                label = "Department Name"
                name="departmentName"
                helperText = "ex: Department of Computer Science"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id = "depHeadName"
                label = "Department Head Name"
                name="departmentHeadName"
                helperText = "ex: Dr.Hans dopez"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id = "depHeadEmail"
                label = "Department Head Email"
                name="departmentHeadEmail"
                helperText = "hansdopez@example.com"
                disabled={isLoading}
                required
            />

            <TextField
                style={TextFieldStyle}
                id = "depPostalAddress"
                label = "Department Postal Address"
                name="departmentPostalAddress"
                helperText = "ex: Department of Computer Science, University of Colombo, Colombo 07"
                disabled={isLoading}
                required
            />
        
        </Box>

        <Divider variant="middle" >
            Qualifications
        </Divider>
        <Box style={{display:"flex",flexWrap:"wrap",alignItems:"start",justifyContent:"space-between",width:"100%",padding:"0 2rem",margin:"3rem 0"}}>
            
            <Box style={{display:"flex",width:"100%",justifyContent:"flex-start"}}>
                <p><strong>Note: </strong>First two qualifications are required. fill the later two if necessary.</p>
            </Box>

            <Box style={TextFieldStyle}>
                <TextField
                    style={{width:"100%",marginBottom:"1rem"}}
                    id="Qualification 1"
                    label="Qualification 1"
                    name="qualification_1"
                    helperText = "degree/post degree/deploma/ certificate"
                    disabled={isLoading}
                    required
                />
                <TextField
                    style={{width:"100%"}}
                    id="slqfLevelId"
                    label="SLQF level"
                    name="qualification_1SlqfLevel"
                    helperText = "SLQF level of above mentioned qualification"
                    disabled={isLoading}
                    required
                />
            </Box>

            <Box style={TextFieldStyle}>
                <TextField
                    style={{width:"100%",marginBottom:"1rem"}}
                    id="Qualification"
                    label="Qualification 2"
                    name="qualification_2"
                    helperText = "degree/post degree/deploma/ certificate"
                    disabled={isLoading}
                    required
                />
                <TextField
                    style={{width:"100%"}}
                    id="slqfLevelId"
                    label="SLQF level"
                    name="qualification_2SlqfLevel"
                    helperText = "SLQF level of above mentioned qualification"
                    disabled={isLoading}
                    required
                />
            </Box>

            <Box style={TextFieldStyle}>
                <TextField
                    style={{width:"100%",marginBottom:"1rem"}}
                    id="Qualification"
                    label="Qualification 3"
                    name="qualification_3"
                    helperText = "degree/post degree/deploma/ certificate"
                    disabled={isLoading}
                />
                <TextField
                    style={{width:"100%"}}
                    id="slqfLevelId"
                    label="SLQF level"
                    name="qualification_3SlqfLevel"
                    helperText = "SLQF level of above mentioned qualification"
                    disabled={isLoading}
                />
            </Box>

            <Box style={TextFieldStyle}>
                <TextField
                    style={{width:"100%",marginBottom:"1rem"}}
                    id="Qualification"
                    label="Qualification 4"
                    name="qualification_4"
                    helperText = "degree/post degree/deploma/ certificate"
                    disabled={isLoading}
                />
                <TextField
                    style={{width:"100%"}}
                    id="slqfLevelId"
                    label="SLQF level"
                    name="qualification_4SlqfLevel"
                    helperText = "SLQF level of above mentioned qualification"
                    disabled={isLoading}
                />
            </Box>
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

export default AddDean
