import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const UpdatePopup = ({ isOpen, onClose, coordinatorDetails, onUpdate }) => {
  const [editedDetails, setEditedDetails] = useState({
    name: coordinatorDetails.name,
    faculty: coordinatorDetails.faculty,
    status: coordinatorDetails.status,
    pgCount: coordinatorDetails.pgCount,
  });

  const handleFieldChange = (fieldName, value) => {
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: value,
    }));
  };

  const handleUpdate = () => {
    onUpdate(editedDetails);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit Coordinator Details</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={editedDetails.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Faculty"
          value={editedDetails.faculty}
          onChange={(e) => handleFieldChange("faculty", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          value={editedDetails.status}
          onChange={(e) => handleFieldChange("status", e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="No.Of.PG Programs"
          value={editedDetails.pgCount}
          onChange={(e) => handleFieldChange("pgCount", e.target.value)}
          fullWidth
          margin="normal"
        />
       
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePopup;
