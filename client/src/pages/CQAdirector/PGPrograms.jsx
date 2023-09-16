import React from "react";
import { Paper, Typography, Avatar } from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";

const PGPrograms = () => {
  // Simulated data
  const coordinatorProfileData = {
    universityName: "University of Colombo",
    facultyInstituteName: "UCSC",
    pgprManagementUnit: "PGPR Name",
    pgprId: "PGPR-54",
    applicationStartDate: "1/6/2023",
    submissionDate: "1/6/2023",
    programCoordinator: "Prof. K.P. Hewagamage",
    deanDirector: "Prof. Ajantha",
    telephoneNat: "01122336658",
    seofLevel: "Level 3",
    profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg", // Profile photo URL
  };

  useSetUserNavigations([
    {
      name: "View Postgraduate Program Details",
      link: "/PGProgra",
    },
  ]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <Paper elevation={3} className="p-6 space-y-4 w-full md:max-w-3xl">
        <Avatar
          alt="Profile Photo"
          src={coordinatorProfileData.profilePhoto}
          sx={{ width: "100px", height: "100px", margin: "0 auto" }}
        />
        <Typography variant="h4" className="font-bold mb-4 text-center">
          Details of Postgraduate Program
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">University:</span>{" "}
          {coordinatorProfileData.universityName}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Faculty/Institute:</span>{" "}
          {coordinatorProfileData.facultyInstituteName}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">PGPR Management Unit:</span>{" "}
          {coordinatorProfileData.pgprManagementUnit}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">PGPR ID:</span>{" "}
          {coordinatorProfileData.pgprId}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Application Start Date:</span>{" "}
          {coordinatorProfileData.applicationStartDate}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Submission Date:</span>{" "}
          {coordinatorProfileData.submissionDate}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Program Coordinator:</span>{" "}
          {coordinatorProfileData.programCoordinator}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Dean/Director:</span>{" "}
          {coordinatorProfileData.deanDirector}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">Telephone (NAT):</span>{" "}
          {coordinatorProfileData.telephoneNat}
        </Typography>
        <Typography variant="body1" className="mb-2">
          <span className="font-bold">SLQF Level:</span>{" "}
          {coordinatorProfileData.seofLevel}
        </Typography>
      </Paper>
    </div>
  );
};

export default PGPrograms;
