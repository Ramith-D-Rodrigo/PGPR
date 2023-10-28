import { Typography, Grid, Box, Chip, Divider } from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";

const IQAUProgramDetails = () => {
  // Simulated data
  const headerInfo = [
    { label: "University:", value: "University of Colombo" },
    {
      label: "Faculty/Institute:",
      value: "University of Colombo School of Computing",
    },
    { label: "PGPR ID:", value: 1},
    { label: "PGPR Name:", value: "MSc" },
    { label: "Application Start Date:", value: "12/12/2020" },
    { label: "Submission Date:", value: "01/01/2021" },
    { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
  ];

  useSetUserNavigations([
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "PG Programs",
      link: "/pgPrograms",
    },
    {
      name: "View Details",
      link: "/pgProgramDetails",
    }
  ]);

  return (
    <>
      <Divider textAlign="left">
        <Chip label="Postgraduate Program" />
      </Divider>
      <Box
        sx={{
          height: "auto",
          backgroundColor: "#D8E6FC",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginY: "1rem",
        }}
      >
        <Grid container spacing={1} columns={{ sm: 6, md: 12 }}>
          {headerInfo.map((infoItem, index) => (
            <>
              <Grid item sm={2} md={2} key={`${index}-label`}>
                <Typography variant="body1" textAlign={"left"}>
                  <b>{infoItem.label}</b>
                </Typography>
              </Grid>
              <Grid item sm={4} md={4} key={`${index}-value`}>
                <Typography variant="body1" textAlign={"left"}>
                  {infoItem.value}
                </Typography>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
      <Divider textAlign="left">
        <Chip label="Previous Statistics" />
      </Divider>
    </>
  );
};

export default IQAUProgramDetails;
