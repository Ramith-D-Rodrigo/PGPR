import { useState, useEffect } from 'react';
import downloadExcelFile from '../../api/Reviewer/downloadExcelFile';
import { Button, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, Typography, ButtonGroup } from '@mui/material';
import FormField from '../../components/FormField';
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

    useEffect(() => {
        document.title = "Import Reviewers";

        const handleGetUniversitiesAndFaculties = async () => {
            try {
                getAllUniversities().then(async (response) => {
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
                });
            }
            catch (error) {
                console.log(error);
                setErrorMsg(error.response.data.message);
            }
        }

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

    const handleSubmitAddUser= async(evt)=>{
        evt.preventDefault();
    }

    const handleReviewerAssignRole = async (userRoles) => {
        console.log((userRoles));
        const isNonAcedamicUser = userRoles.some((userRole,index)=>{
            return (
                userRole == "cqa_director" ||
                userRole == "cqa_officer" ||
                userRole == "iqau_director"
            )? 
            true : false;
        })

        isNonAcedamicUser? 
            setOpenModal(true)
            :
            setOpenDialog(true);

    }

    const dialogStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [wait, setWait] = useState(false);

    return (
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
                    Upload the Excel File Here
                </Box>
                <Box sx={{ m: 1 }}>
                    <form onSubmit={handleExcelUpload}>
                        <Input type="file" inputProps={{ accept: '.xlsx' }} onChange={
                            (e) => {
                                setExcelFile(e.target.files[0]);
                            }
                        } />
                        <Button type="submit" disabled={wait}>Upload</Button>
                    </form>
                </Box>
            </Box>

            <Divider textAlign='left'>
                <Chip label="Registered User List" />
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', my: '1rem' }}>
                <Box sx={{ m: 1 }}>
                    If registering user is present in the system, go through the following table and assign the reviewer role to the user.
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
                                                        setAssigningUserId(universitySide.id);
                                                        handleReviewerAssignRole(JSON.parse(universitySide.user.roles));
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
                <form style={{ padding: "20px 40px" }} onSubmit={handleSubmitAddUser}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                        <FormField required={true} label={"Account For"} type={"select"} key={"VCCQA"} options={[
                            { name: "vc", value: "vice_chancellor", label: "Vice Chancellor" },
                            { name: "cqa", value: "cqa_director", label: "CQA Director" },
                        ]} />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                        
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
                onSubmit={()=>setOpenDialog(false)}
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
    );
}

export default ImportReviewers;