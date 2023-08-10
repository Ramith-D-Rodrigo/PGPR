import { useLocation } from "react-router-dom";
import { Paper } from "@mui/material";

const ViewPGPDetails = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const program = decodeURIComponent(queryParams.get("program"));

  return (
    <Paper>
      {program ? (
        <>
          <h2>{program.title}</h2>
          <p>
            <strong>SLQF Level:</strong> {program.slqf_level}
          </p>
          <p>
            <strong>Commencement Year:</strong> {program.commencement_year}
          </p>
          <p>
            <strong>Program Coordinator:</strong> {program.program_coordinator}
          </p>
          {/* Add more program details here as needed */}
        </>
      ) : (
        <p>Program not found.</p>
      )}
    </Paper>
  );
};

export default ViewPGPDetails;
