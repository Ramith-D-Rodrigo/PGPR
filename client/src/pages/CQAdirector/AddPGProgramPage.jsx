import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';


const AddPGProgramPage = () => {
  useSetUserNavigations([
    {
      name: 'Add PG Program',
      link: '/AddPGProgramPage',
    },
  ]);

  // Define your form submission logic here
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    // Handle form submission
    console.log(formValues);
  };

  // Define your form cancellation logic here
  const handleCancel = () => {
    // Handle form cancellation
    console.log('Form cancelled');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add PG Program</h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <form onSubmit={handleSubmit}>



<div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="University Name"
    variant="outlined"
    name="university"
  />
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Faculty/University Name"
    variant="outlined"
    name="faculty"
  />
</div>
<div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="PGPR Management Unit"
    variant="outlined"
    name="MgtUnit"
  />
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="PGPR Name"
    variant="outlined"
    name="pgprname"
  />
</div>
<div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Application Start Date"
    variant="outlined"
    name="startdate"
    type="date"
    InputLabelProps={{
      shrink: true,
    }}
  />
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Submission Date"
    variant="outlined"
    name="subdate"
    type="date"
    InputLabelProps={{
      shrink: true,
    }}
  />
</div>
<div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Program Coordinator"
    variant="outlined"
    name="programCoordinator"
  />
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Dean/Director"
    variant="outlined"
    name="deanDirector"
  />
</div>
<div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="Phone"
    variant="outlined"
    name="number"
    type="number"
  />
  <TextField
    style={{ flexBasis: '48%', marginBottom: '1.5rem', height: '2rem' }}
    fullWidth
    label="SLQF Level"
    variant="outlined"
    name="slqfLevels"
  />
</div>




        {/* Add similar TextField components for other form fields */}
        <div className="flex justify-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            style={{ marginRight: '16px' }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPGProgramPage;
