import { useState, useEffect } from 'react';
import downloadExcelFile from '../../api/Reviewer/downloadExcelFile';
import { Button, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
import getAllUniversities from '../../api/University/getAllUniversities';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import importReviewers from '../../api/Reviewer/importReviewers';
import Chip from '@mui/material/Chip';
import { Divider } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import Paper from '@mui/material/Paper';
import tableStyle from '../../assets/tableStyle';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


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

    useEffect(() => {
        const handleGetUniversitiesAndFaculties = async () => {
            try {
                const universitiesResult = await getAllUniversities();

                if (universitiesResult.status === 200) {

                    const universityWithFaculties = await Promise.all(
                        //get faculties of each university
                        universitiesResult.data.data.map(async (university) => {
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


            <Typography sx={{margin: '3rem 0'}}>
                Use the following information regarding the faculties of each university to fill the excel file.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Box sx={{ m: 1 }}>
                    Search University
                </Box>
                <Box sx={{ m: 1 }}>
                    <Input type="text" placeholder="Search" onChange={handleSearch} />
                </Box>
            </Box>



            <TableContainer>
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