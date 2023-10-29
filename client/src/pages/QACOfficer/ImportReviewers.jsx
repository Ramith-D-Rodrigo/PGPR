import { useState, useEffect } from 'react';
import downloadExcelFile from '../../api/Reviewer/downloadExcelFile';
import { Button, Input, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import getAllUniversities from '../../api/University/getAllUniversities';
import getUniversityFaculties from '../../api/University/getUniversityFaculties';
import importReviewers from '../../api/Reviewer/importReviewers';
import blobToHash from 'blob-to-hash';
import Chip from '@mui/material/Chip';
import { Divider } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const ImportReviewers = () => {

    const [excelHash, setExcelHash] = useState(null); //to store the hash of the downloaded excel file and compare it with the uploaded excel file (to check whether the user has modified the downloaded excel file)

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

                //set the hash
                const hash = await blobToHash('sha256', downloadResult.data);
                setExcelHash(hash);
            }
        }
        catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }
    }

    const [universities, setUniversities] = useState([]);

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
                alert(error.response.data.message);
            }
        }

        handleGetUniversitiesAndFaculties();
    }, []);

    const [excelFile, setExcelFile] = useState(null);


    const handleExcelUpload = async (e) => {
        e.preventDefault();

        if (!excelFile) {
            alert("Please select an excel file");
            return;
        }

        if (!excelHash) {
            alert("Please download the excel template first");
            return;
        }

        const fileHash = await blobToHash('sha256', excelFile);

        if (fileHash === excelHash) { //uploaded the same file (not modified)
            alert("Please fill the excel file with reviewer details");
            return;
        }

        try {
            const uploadResult = await importReviewers(excelFile);

            if (uploadResult.status) {
                alert(uploadResult.data.message);
            }

        }
        catch (error) {
            console.log(error);
            alert(error.response.data.message);
        }

    }


    return (
        <>
            <Divider textAlign='left'>
                <Chip label="Import Reviewers" />
            </Divider>

            <Box sx={{ display: 'flex', my: 3, justifyContent:'center' }}>
                <Button onClick={handleExcelDownload} variant='contained'>Download Excel Template</Button>
            </Box>

            <Box sx={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                <Box sx={{m:1}}>
                    Upload the Excel File Here
                </Box>
                <Box sx={{m:1}}>
                    <form onSubmit={handleExcelUpload}>
                        <Input type="file" inputProps={{ accept: '.xlsx' }} onChange={
                            (e) => {
                                setExcelFile(e.target.files[0]);
                            }
                        } />
                        <Button type="submit">Upload</Button>
                    </form>
                </Box>
            </Box>


            <div>
                <h1>Use the Following Data for adding University and Faculty of each Reviewer</h1>
                <br />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow style={{backgroundColor:"#D8E6FC",}}>
                                <TableCell align='center'><strong>University Name</strong></TableCell>
                                <TableCell align='center'><strong>University ID</strong></TableCell>
                                <TableCell align='center'><strong>Faculties</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                universities.map((university) => (
                                    <TableRow key={university.id}>
                                        <TableCell align='center'>{university.name}</TableCell>
                                        <TableCell align='center'>{university.id}</TableCell>
                                        <TableCell align='center'>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Faculty Name</TableCell>
                                                        <TableCell>Faculty ID</TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>

                </TableContainer>
            </div>
        </>
    )
}

export default ImportReviewers