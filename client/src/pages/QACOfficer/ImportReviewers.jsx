import { useState, useEffect } from 'react';
import downloadExcelFile from '../../api/Reviewer/downloadExcelFile';
import { Button, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, Typography, ButtonGroup, CircularProgress } from '@mui/material';
import FormField from '../../components/FormField';
import TextField from '@mui/material/TextField';
import getAllUniversities from '../../api/University/getAllUniversities';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import importReviewers from '../../api/Reviewer/importReviewers';
import Chip from '@mui/material/Chip';
import { Divider } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import tableStyle from '../../assets/tableStyle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import getAllUniversitySides from '../../api/UniversitySide/getAllUniversitySides';
import DialogMenu from '../../components/DialogMenu';
import assignReviewerRole from '../../api/QACOfficer/assignReviewerRole';

const ImportReviewers = () => {

    useSetUserNavigations(
        [{
            name: "Dashboard",
            link: "/"
        },
        {
            name: "Reviewers",
            link: "/reviewers"
        },
        {
            name: "Import Reviewers",
            link: "/reviewers/import"
        },
        ]
    );

    const handleExcelDownload = async () => {
        try {
            const downloadResult = await downloadExcelFile();

            if (downloadResult.status === 200) {
                //downloadResult.data is a blob object
                const url = window.URL.createObjectURL(new Blob([downloadResult.data]));
                const link = document.createElement('a');
                link.href = url;
                const fileName = 'reviewers.xlsx';
                link.download = fileName;
                link.click();

                link.remove();
                window.URL.revokeObjectURL(url);

            }
        }
        catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    const [universities, setUniversities] = useState([]);
    const [excelFile, setExcelFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [userList, setUserList] = useState([]);
    const [openModal,setOpenModal] = useState(false);
    const [openDialog,setOpenDialog] = useState(false);
    const [assigningUserId, setAssigningUserId] = useState(null);
    const [submitDialogMenu,setSubmitDialogMenu] = useState(()=>{return ()=>setOpenDialog(false)});
    const [loading,setLoading] = useState(true);

    const handleGetUniversitiesAndFaculties = async () => {
        try {
            getAllUniversities().then(async (response) => {
                setLoading(true);
                if (response.status === 200) {

                    const universityWithFaculties = await Promise.all(
                        //get faculties of each university
                        response.data.data.map(async (university) => {
                            //get faculties of each university
                            const facultiesResult = await getUniversityFaculties(university.id);

                            if (facultiesResult.status === 200) {
                                return {
                                    ...university,
                                    faculties: facultiesResult.data.data
                                };
                            }

                            return university;
                        })
                    )

                    setUniversities(universityWithFaculties);
                }
            });

            getAllUniversitySides().then((response) => {
                if (response.status === 200) {
                    console.log(response.data.data);
                    setUserList(response.data.data);
                }
                setLoading(false);
            });
        }
        catch (error) {
            console.log(error);
            setErrorMsg(error.response.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = "Import Reviewers";
        handleGetUniversitiesAndFaculties();
    }, []);


    const handleExcelUpload = async (e) => {
        e.preventDefault();

        if (!excelFile) {
            setErrorMsg("Please upload the excel file");
            return;
        }

        //check file extension
        const fileExtension = excelFile.name.split('.').pop();

        if (fileExtension !== "xlsx") {
            setErrorMsg("Please upload a valid excel file");
            return;
        }

        setWait(true);

        try {
            const uploadResult = await importReviewers(excelFile);

            if (uploadResult.status) {
                setSuccessMsg(uploadResult.data.message);
            }

        }
        catch (error) {
            console.log(error);
            setErrorMsg(error.response.data.message);
        }

        setWait(false);
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleUserSearch = (event) => {
        setSearchUser(event.target.value);
    }

    const handleSubmitAddUser= (evt)=>{
        evt.preventDefault();
        setSubmitDialogMenu(()=>{
            return ()=>{
                handleAddUser(evt,false,assigningUserId);
                setOpenDialog(false);
                setOpenModal(false);
            }
        });
        setOpenDialog(true);
    }

    const handleAddUser = async(evt,isUniversitySide,universitySideId)=>{
        try{
            setLoading(true);
            console.log(universitySideId);
            if(isUniversitySide)
            {
                const response = await assignReviewerRole(universitySideId);
                console.log(response?.data?.data);
            }
            else{
                const formData = new FormData(evt.target);
                const response = await assignReviewerRole(universitySideId,formData);
                console.log(response?.data?.data);
            }
            handleGetUniversitiesAndFaculties();
            setSuccessMsg("User Assigned Successfully !");
        }
        catch(err){
            console.log(err);
            setLoading(false);
            setErrorMsg(err?.response?.data?.message?? "Error Occured");
        }
    }

    const handleReviewerAssignRole = (userRoles,universitySideId) => {
        console.log((userRoles));
        const isNonAcedamicUser = userRoles.some((userRole,index)=>{
            return (
                userRole == "cqa_director" ||
                userRole == "iqau_director"
            )? 
            true : false;
        })

        if(isNonAcedamicUser)
        {
            setOpenModal(true)
        }
        else{
            setSubmitDialogMenu(()=>{
                return ()=>{
                    handleAddUser(null,true,universitySideId);
                    setOpenDialog(false);
                    setOpenModal(false);
                }
            });
            setOpenDialog(true);
        }

    }

    const dialogStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const dialogFieldStyle = {
        margin:'0.5rem 1rem'
    }

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [wait, setWait] = useState(false);

    return (
        <>
        {loading?
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}>
                        <CircularProgress
                        style={{ margin: "0 0 0 20px", color: "darkblue" }}
                        thickness={5}
                        size={40}
                        />
                    </div>
        :
        <>
            <Snackbar
                open={errorMsg == "" ? false : true}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setErrorMsg("")}
            >
                <Alert onClose={() => setErrorMsg("")} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={successMsg == "" ? false : true}
                autoHideDuration={1500}
                onClose={() => setSuccessMsg("")}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setSuccessMsg("")} severity="success">
                    {successMsg}
                </Alert>
            </Snackbar>

            <Snackbar
                open={wait}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="info">
                    Please wait...
                </Alert>
            </Snackbar>


            <Divider textAlign='left'>
                <Chip label="Import Reviewers" />
            </Divider>

            <Box sx={{ display: 'flex', my: 3, justifyContent: 'center' }}>
                <Button onClick={handleExcelDownload} variant='contained'>Download Excel Template</Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{ m: 1 }}>
                    <strong>Upload the Excel File Here</strong>
                </Box>
                <Box sx={{ m: 1 }}>
                    <form onSubmit={handleExcelUpload}>
                        <Input type="file" inputProps={{ accept: '.xlsx' }} onChange={
                            (e) => {
                                setExcelFile(e.target.files[0]);
                            }
                        } />
                        <Button sx={{margin:'0 0 0 1rem'}} variant="outlined" type="submit" disabled={wait}>Upload</Button>
                        <Typography sx={{margin:'1rem 0'}} id="modal-modal-title" variant="subtitle1" component="h2">
                           <strong> Note* : Please use university and faculty details at the bottom when filling user data in excel file or the forms in this page</strong>
                        </Typography>
                    </form>
                </Box>
            </Box>

            <Divider textAlign='left'>
                <Chip label="Registered User List" />
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', my: '1rem' }}>
                <Box sx={{ m: 1 }}>
                    <strong>If registering user is present in the system, go through the following table and assign the reviewer role to the user.</strong>
                </Box>
                <Box sx={{ m: 1 }}>
                    Search by Name : <Input type="text" placeholder="Search" onChange={handleUserSearch} />
                </Box>
                <Box sx={{ m: 1 }}>
                    <TableContainer component={Paper}>
                        <Table sx={tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">User&apos;s Initials</TableCell>
                                    <TableCell align="center">User&apos;s Last Name</TableCell>
                                    <TableCell align="center">User&apos;s Full Name</TableCell>
                                    <TableCell align="center">University</TableCell>
                                    <TableCell align="center">Current Roles</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userList.filter((universitySide) => {
                                    if (searchUser === "") {
                                        return universitySide;
                                    } else if (universitySide.user.fullName.toLowerCase().includes(searchUser.toLowerCase())) {
                                        return universitySide;
                                    }
                                }).map((universitySide) => (
                                    <TableRow
                                        key={universitySide.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="center">
                                            {universitySide.user.initials}
                                        </TableCell>
                                        <TableCell align="center">{universitySide.user.surname}</TableCell>
                                        <TableCell align="center">{universitySide.user.fullName}</TableCell>
                                        <TableCell align="center">{universitySide.university.name}</TableCell>
                                        <TableCell align="center">
                                            {JSON.parse(universitySide.user.roles).map(role => {
                                                return (
                                                    <Typography key={role + universitySide.user.id}>{
                                                        role.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

                                                    }</Typography>
                                                )
                                            })

                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <ButtonGroup>
                                                <Button variant="contained" color="success" onClick={() => {
                                                        setAssigningUserId(universitySide.user.id);
                                                        handleReviewerAssignRole(JSON.parse(universitySide.user.roles),universitySide.user.id);
                                                    }}
                                                    disabled={
                                                        JSON.parse(universitySide.user.roles).includes("reviewer") ? true : false || wait 
                                                    }>
                                                    Assign Reviewer Role
                                                </Button>
                                                <Button variant="contained" color="primary">
                                                    View Profile
                                                </Button>
                                            </ButtonGroup>
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            {/* modal */}
            <Modal
                open={openModal}
                onClose={()=>setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={dialogStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Fill the Additional required details
                </Typography>
                <Divider sx={{ marginTop: "1rem", marginBottom: "1rem" }} />
                <form id="additionalFormId" style={{ padding: "20px 40px" }} onSubmit={handleSubmitAddUser}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                    {
                    // 'google_scholar_link' => ['required', 'string', 'url'],
                    // 'designation' => ['required', 'string'],
                    // 'qualification_1' => ['required', 'string', 'max:255'],
                    // 'qualification_1_slqf_level' => ['required', 'integer'],
                    // 'qualification_2' => ['required', 'string', 'max:255'],
                    // 'qualification_2_slqf_level' => ['required', 'integer'],
                    // 'qualification_3' => ['string', 'max:255', 'present', 'nullable'],
                    // 'qualification_3_slqf_level'=> ['integer', 'present', 'nullable'],
                    // 'qualification_4' => ['string', 'max:255', 'present', 'nullable'],
                    // 'qualification_4_slqf_level' => ['integer', 'present', 'nullable'],
                    // 'working_faculty' => ['required', 'integer', 'exists:faculties,id'],
                    }
                    <TextField
                        sx={dialogFieldStyle}
                        id="google_scholar_link_id"
                        label="google_scholar_link"
                        name="google_scholar_link"
                        type="url"
                        helperText="google_scholar_link"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="designation_id"
                        label="designation"
                        name="designation"
                        helperText="designation"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="working_faculty_id"
                        label="working_faculty"
                        name="working_faculty"
                        helperText="working_faculty"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_1_id"
                        label="qualification_1"
                        name="qualification_1"
                        helperText="qualification_1"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_1_slqf_level_id"
                        type='number'
                        min='8'
                        max='12'
                        label="qualification_1_slqf_level"
                        name="qualification_1_slqf_level"
                        helperText="qualification_1_slqf_level"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_2_id"
                        label="qualification_2"
                        name="qualification_2"
                        helperText="qualification_2"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_2_slqf_level_id"
                        type='number'
                        min='8'
                        max='12'
                        label="qualification_2_slqf_level"
                        name="qualification_2_slqf_level"
                        helperText="qualification_2_slqf_level"
                        variant="standard"
                        required
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_3_id"
                        label="qualification_3"
                        name="qualification_3"
                        helperText="not required"
                        variant="standard"
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_3_slqf_level_id"
                        type='number'
                        min='8'
                        max='12'
                        label="qualification_3_slqf_level"
                        name="qualification_3_slqf_level"
                        helperText="not required"
                        variant="standard"
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_4_id"
                        label="qualification_4"
                        name="qualification_4"
                        helperText="not required"
                        variant="standard"
                    />
                    <TextField
                        sx={dialogFieldStyle}
                        id="qualification_4_slqf_level_id"
                        type='number'
                        min='8'
                        max='12'
                        label="qualification_4_slqf_level"
                        name="qualification_4_slqf_level"
                        helperText="not required"
                        variant="standard"
                    />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap",margin:'1rem 0 0' }}>
                        <Button type='submit' variant='contained'>Assign as Reviewer</Button>
                    </Box>
                    {/* <Box sx={{margin:"0.5rem 0",display:'flex',flexWrap:"wrap",justifyContent:'center',alignItems:'center',width:'100%'}}>
                            {Loading? "Processing " : ""}
                            {Loading && <CircularProgress style={{margin:"0 0.5rem"}} color="primary" size={24} />}
                        </Box> */}
                </form>
                {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography> */}
                </Box>
            </Modal>

            <DialogMenu
                Message={"Are you sure you want to add this user as a reviewer?"}
                Warning={"Once you assign this user as a reviewer, you can't undo this action"}
                Actions={{submit:'add user',cancel:'cancel'}}
                onClose={()=>setOpenDialog(false)}
                Open={openDialog}
                onSubmit={submitDialogMenu}
            ></DialogMenu>


            <Divider textAlign='left'>
                <Chip label="Universities and Faculties" />
            </Divider>


            <Box sx={{ margin: '3rem 0' }}>
                Use the following information regarding the faculties of each university to fill the excel file.
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{ m: 1 }}>
                    Search University
                </Box>
                <Box sx={{ m: 1 }}>
                    <Input type="text" placeholder="Search" onChange={handleSearch} />
                </Box>
            </Box>



            <TableContainer component={Paper}>
                <Table sx={tableStyle}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">University Name</TableCell>
                            <TableCell align="center">University ID</TableCell>
                            <TableCell align="center">Faculties</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {universities.filter((university) => {
                            if (searchTerm === "") {
                                return university;
                            } else if (university.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return university;
                            }
                        }).map((university) => (
                            <TableRow
                                key={university.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="center">
                                    {university.name}
                                </TableCell>
                                <TableCell align="center">{university.id}</TableCell>
                                <TableCell align="center">
                                    <TableContainer>
                                        <Table sx={tableStyle}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align="center">Faculty Name</TableCell>
                                                    <TableCell align="center">Faculty ID</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    university.faculties.map((faculty) => (
                                                        <TableRow key={faculty.id}>
                                                            <TableCell>{faculty.name}</TableCell>
                                                            <TableCell>{faculty.id}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
        }
        </>
    );
}

export default ImportReviewers;