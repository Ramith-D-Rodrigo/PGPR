import React from 'react'
import { useParams } from 'react-router-dom';
import useAuth from "../../hooks/useAuth.js";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, TextField, Typography, Divider } from "@mui/material";

function SubmitReports() {

    const {auth} = useAuth();
    const {pgprId } = useParams();
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "Submit Reports",
                link: `/PG_Assignments/Submit_Reports/${pgprId}`
            }
        ]
    );

    const [selectedPreliminaryFiles, setSelectedPreliminaryFiles] = useState([]);
    const [selectedFinalFiles, setselectedFinalFiles] = useState([]);
    const [uploadPreliminaryStatus, setUploadPreliminaryStatus] = useState("");
    const [uploadFinalStatus, setUploadFinalStatus] = useState("");


      const handleSubmitFinal = () => {
        const fileNames = selectedFinalFiles.map((file) => file.name);
        setUploadFinalStatus(`Selected Files: ${fileNames.join(", ")}`);
      };

      const handleFileChangePreliminary = (event) => {
        console.log("pre",event.target.files);
        const files = Array.from(event.target.files);
        setSelectedPreliminaryFiles(files);
      }

        const handleSubmitPreliminary = () => {
        const fileNames = selectedPreliminaryFiles.map((file) => file.name);
        setUploadPreliminaryStatus(`Selected Files: ${fileNames.join(", ")}`);
        };

        const handleFileChangeFinal = (event) => {
            console.log("final",event.target.files);
            const files = Array.from(event.target.files);
            setselectedFinalFiles(files);
        }

    //   review-team-chair/submit/preliminary-report


  return (
    <>
    <Container>
        <Typography variant="h5" align="center" gutterBottom>
            Submit Preliminary Report
        </Typography>
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              multiple
              onChange={handleFileChangePreliminary}
              style={{ display: "none" }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span">
                Select Files
              </Button>
            </label>
            <TextField
              fullWidth
              value={uploadPreliminaryStatus}
              variant="outlined"
              disabled
              multiline
              rows={3}
              label="Selected Files"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitPreliminary}
              disabled={selectedPreliminaryFiles.length === 0}
            >
              Submit Files
            </Button>
    </Container>

    <Divider sx={{ my: 10 }} />

    <Typography variant="h6" align="center" gutterBottom>
           Note* : After University side accept the preliminary report, you can submit the final report.
        </Typography>

    <Container>
        <Typography variant="h5" align="center" gutterBottom>
            Submit Final Report
        </Typography>
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              multiple
              onChange={handleFileChangeFinal}
              style={{ display: "none" }}
              id="file-input-1"
            />
            <label htmlFor="file-input-1">
              <Button variant="contained" component="span">
                Select Files
              </Button>
            </label>
            <TextField
              fullWidth
              value={uploadFinalStatus}
              variant="outlined"
              disabled
              multiline
              rows={3}
              label="Selected Files"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitFinal}
              disabled={selectedFinalFiles.length === 0}
            >
              Submit Files
            </Button>
    </Container>
    </>
  )
}

export default SubmitReports