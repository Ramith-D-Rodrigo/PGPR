import React from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, Paper } from "@mui/material";
import { NavigateBefore } from "@mui/icons-material";

const CoordinatorProfile = ({ coordinatorData }) => {
  const { cid } = useParams();
  const coordinator = coordinatorData.find((coordinator) => coordinator.cid === cid);

  if (!coordinator) {
    return <div>Coordinator not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
      <h2 className="text-2xl font-bold text-center">Coordinator Profile</h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <div className="flex justify-center items-center">
        <Avatar alt="Profile Photo" src={coordinator.profilePhoto} />
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{coordinator.name}</h3>
          <p className="text-gray-600">{coordinator.cid}</p>
        </div>
      </div>
    
      <div className="mt-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBefore />}
          onClick={() => {
            // Handle navigation back to the previous page
            // You can use history.push or any routing mechanism of your choice
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default CoordinatorProfile;
