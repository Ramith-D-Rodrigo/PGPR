import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
  Snackbar,
  Alert,
  Box,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import createPostGraduateProgram from "../../api/PostGraduateProgram/createPostGraduateProgram";
import getCQADirectorUniversity from "../../api/CQADirector/getCQADirectorUniversity";
import getUniversityFaculties from "../../api/University/getUniversityFaculties"; 
import SnackbarContainer from "../../components/SnackbarContainer";

function AddPostGraduateProgram() {
  useSetUserNavigations([
    {
      name: "Post Graduate Programs",
      link: "/post-graduate-programs",
    },
    {
      name: "Add Post Graduate Program",
      link: "/post-graduate-programs/add",
    },
  ]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slqfLevel, setSlqfLevel] = useState(7); // Default to 7
  const [isProfessionalProgram, setIsProfessionalProgram] = useState(false);
  const [commencementYear, setCommencementYear] = useState("");
  const [faculties, setFaculties] = useState([]);
  const { auth } = useAuth();
  const cqaDirectorId = auth.id;
  console.log("cqaDirectorId:", cqaDirectorId);

  const [facultyId, setFacultyId] = useState(""); // Update to use facultyId
  const [titleError, setTitleError] = useState({
    err: { error: false },
    msg: "",
  });
  const [slqfLevelError, setSlqfLevelError] = useState({
    err: { error: false },
    msg: "",
  });
  const [commencementYearError, setCommencementYearError] = useState({
    err: { error: false },
    msg: "",
  });
  const [facultyIdError, setFacultyIdError] = useState({
    err: { error: false },
    msg: "",
  });

  const [added, setAdded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Function to open the Snackbar with a message and severity
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleClickAddProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTitleError({ err: { error: false }, msg: "" });
    setSlqfLevelError({ err: { error: false }, msg: "" });
    setCommencementYearError({ err: { error: false }, msg: "" });
    setFacultyIdError({ err: { error: false }, msg: "" });

    if (title === "") {
      setTitleError({ err: { error: true }, msg: "Title is required" });
      setLoading(false);
      return;
    }

    if (slqfLevel < 7 || slqfLevel > 12) {
      setSlqfLevelError({
        err: { error: true },
        msg: "SLQF Level should be between 7 and 12",
      });
      setLoading(false);
      return;
    }

    if (commencementYear === "") {
      setCommencementYearError({
        err: { error: true },
        msg: "Commencement Year is required",
      });
      setLoading(false);
      return;
    }

    if (facultyId === "") {
      setFacultyIdError({
        err: { error: true },
        msg: "Faculty ID is required",
      });
      setLoading(false);
      return;
    }

    const programData = {
      title: title,
      slqf_level: slqfLevel,
      is_professional_pg_programme: isProfessionalProgram ? 1 : 0,
      commencement_year: commencementYear,
      faculty_id: facultyId, // Use facultyId
    };

    try {
      const creationResult = await createPostGraduateProgram(programData);
      console.log(creationResult.data);
      showSnackbar("Program added successfully!", "success");
      setLoading(false);
      setTimeout(() => {
        navigate("../", { replace: true });
      }, 1000);
    } catch (err) {
      console.log("message: ", err?.response?.data?.message);
      console.log("errors: ", err?.response?.data?.errors);
      showSnackbar(err?.response?.data?.message, "error");
      setLoading(false);
    }
  };


  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from the backend using API calls
        const cqaDirectorId = auth.id;
        console.log("cqaDirectorId:", cqaDirectorId); // Log cqaDirectorId
        const universityResponse = await getCQADirectorUniversity(
          cqaDirectorId
        );
        const universityData = universityResponse.data.data;

        // Check if the university data is available
        if (universityData) {
          console.log("University Data:", universityData);

          // Fetch faculties for the university using getUniversityFaculties
          const facultyResponse = await getUniversityFaculties(
            universityData.id // Use the universityId from universityData
          );

          const facultyData = facultyResponse.data.data;
          console.log("Faculty Data:", facultyData);

          setFaculties(facultyData); // Update to use facultyData
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <form
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "90%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          onSubmit={handleClickAddProgram}
        >
          {/* Title */}
          <FormControl
            sx={{ padding: "15px 10px", width: "48%", boxSizing: "border-box" }}
            {...titleError.err}
            variant="outlined"
          >
            <InputLabel htmlFor="title">
              <b>Title</b>
            </InputLabel>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              aria-describedby="title"
              type="text"
            />
            {titleError.err.error && (
              <FormHelperText id="title-error-text">
                {titleError.msg}
              </FormHelperText>
            )}
          </FormControl>

          {/* SLQF Level */}
          <FormControl
            sx={{ padding: "15px 10px", width: "48%", boxSizing: "border-box" }}
            {...slqfLevelError.err}
            variant="outlined"
          >
            <InputLabel htmlFor="slqf-level">
              <b>SLQF Level</b>
            </InputLabel>
            <Input
              required
              value={slqfLevel}
              onChange={(e) => setSlqfLevel(e.target.value)}
              id="slqfLevel"
              aria-describedby="slqf-level"
              type="number"
              inputProps={{ min: 7, max: 12 }}
            />
            {slqfLevelError.err.error && (
              <FormHelperText id="slqf-level-error-text">
                {slqfLevelError.msg}
              </FormHelperText>
            )}
          </FormControl>

          {/* Is Professional Program */}
          <FormControl
            sx={{
              padding: "15px 10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isProfessionalProgram}
                  onChange={(e) => setIsProfessionalProgram(e.target.checked)}
                  name="isProfessionalProgram"
                />
              }
              label="Is Professional Program"
            />
          </FormControl>

          {/* Commencement Year */}
          <FormControl
            sx={{ padding: "15px 10px", width: "48%", boxSizing: "border-box" }}
            {...commencementYearError.err}
            variant="outlined"
          >
            <InputLabel htmlFor="commencement-year">
              <b>Commencement Year</b>
            </InputLabel>
            <Input
              required
              value={commencementYear}
              onChange={(e) => setCommencementYear(e.target.value)}
              id="commencementYear"
              aria-describedby="commencement-year"
              type="text"
            />
            {commencementYearError.err.error && (
              <FormHelperText id="commencement-year-error-text">
                {commencementYearError.msg}
              </FormHelperText>
            )}
          </FormControl>

          {/* Faculty */}
          <FormControl
            sx={{ padding: "15px 10px", width: "48%", boxSizing: "border-box" }}
            variant="outlined"
          >
            <InputLabel htmlFor="faculty-select">
              <b>Faculty</b>
            </InputLabel>
            <Select
              label="Faculty"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              inputProps={{
                name: "faculty",
                id: "faculty-select",
              }}
            >
              {faculties.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <FormControl
            sx={{
              padding: "15px 10px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <Button
              type="submit"
              color="primary"
              variant="contained"
              sx={{
                width: "100%",
                fontSize: "16px",
                fontWeight: "bold",
                padding: "12px 0",
                marginTop: "20px",
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="inherit" size={26} />
              ) : (
                "Add PostGraduate Program"
              )}
            </Button>
          </FormControl>
        </form>
      </Box>
       {/* SnackbarContainer for displaying messages */}
       <SnackbarContainer
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
}

export default AddPostGraduateProgram;
