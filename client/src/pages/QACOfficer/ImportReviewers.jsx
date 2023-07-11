import { Button, Divider, Input, MenuItem, Select, Typography} from '@mui/material'
import React from 'react';
import  importReviewers  from '../../api/QACOfficer/importReviewers.js';

const ImportReviewers = () => {

    const [file , setFile] = React.useState(null);

    const handleFileChange = (e) => {
        //only allow excel files
        if(e.target.files[0].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            setFile(e.target.files[0]);

            //set the date of upload
            const date = new Date();
            const dateElement = document.getElementById("uploadDate");
            dateElement.value = date.toISOString().slice(0,10);

        }
        else{
            alert("Please upload an excel file");
            e.target.value = null;  //clear the input
        }
    }

    const handleUpload = async () => {
        if(file === null){
            alert("Please upload a file");
        }
        else{
            const promise = await importReviewers(file);

            if(promise.status === 200){ //success
                alert("File Uploaded Successfully");
            }
            else{
                alert(promise.data);
            }
        }
        setFile(null);  //clear the input
    }

    return (
        <>
            <Typography variant="h3">Import Reviewers</Typography>
            <Divider />
            <Button variant="contained">Download Excel Sheet Format</Button>
            <Typography>Upload the Excel File</Typography>
            <Input type="file" 
            onChange={handleFileChange}
            />
            <Typography>Date of Upload</Typography>
            <Input type="date" id="uploadDate" readOnly/>
            <Typography>Status to Set</Typography>
            <Select>
                <MenuItem value="1">Active</MenuItem>
            </Select>
            <Button variant="contained" onClick={handleUpload}>Upload</Button>
        </>
    )
}

export default ImportReviewers