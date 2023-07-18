import React from 'react';
import Form from '../../components/Form';
import MainContent from '../../components/MainContent';


const AddAccounts = () => {
  // Define your form submission logic here
  const handleSubmit = (formValues) => {
    // Handle form submission
    console.log(formValues);
  };

  // Define your form cancellation logic here
  const handleCancel = () => {
    // Handle form cancellation
    console.log('Form cancelled');
  };

  return (
   
    
    <div>
      <Form
        topic="Create Account for Program Coordinator/Director/Dean"
        fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'cId', label: 'C-ID', type: 'text' },
            { name: 'position', label: 'Position', type: 'text' },
            { name: 'faculty', label: 'Faculty/Institute Name', type: 'text' },
            { name: 'department', label: 'Department', type: 'text' },
            { name: 'qualification', label: 'Qualification', type: 'text' },
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'email', label: 'Email Address', type: 'email' },
            { name: 'status', label: 'Status', type: 'text' },
          ]}
          cancelButtonText="Cancel"
        submitButtonText="Create Account"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
    
  );
};

export default AddAccounts;
