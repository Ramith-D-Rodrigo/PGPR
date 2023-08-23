import React from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import { Avatar, Button } from "@mui/material";

const CoordinatorProfile = ({actions }) => {
  const { coordinatorID } = useParams(); 
  const coordinator = coordinatorData.find(
    (coordinator) => coordinator.coordinatorID === coordinatorID
  );

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
          <p className="text-gray-600">Coordinator ID: {coordinator.coordinatorID}</p>
          <p className="text-gray-600">University: {coordinator.university}</p>
          <p className="text-gray-600">Faculty: {coordinator.faculty}</p>
          <p className="text-gray-600">Number of Programs: {coordinator.numPrograms}</p>
        </div>
      </div>
      <div className="mt-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.allow ? `/CoordinatorProfile/${coordinator.coordinatorID}` : ''}
          >
            <Button
              style={{ margin: "0 8px" }}
              variant="contained"
              color="primary"
              size="small"
            >
              {action.action}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoordinatorProfile;
