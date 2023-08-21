import React from 'react';
import Form from '../../components/Form';
import MainContent from '../../components/MainContent';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';


const AddAccounts = () => {

  useSetUserNavigations(
    [
        {
          name: "Manage Accounts",
          link: "/AddAccounts"
        },
      
    ]
);
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
   
      
        <Form
          topic="Create Account for Program Coordinator/Director/Dean"
          fields={[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'title', label: 'Title', type: 'select', options: ['Mr', 'Dr', 'Prof', 'Mrs', 'Ms'] },
            { name: 'cId', label: 'C-ID', type: 'text' },
            { name: 'position', label: 'Position', type: 'text' },
            { name: 'faculty', label: 'Faculty/Institute Name', type: 'text' },
            { name: 'department', label: 'Department', type: 'text' },
            { name: 'qualification', label: 'Qualification', type: 'text' },
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'email', label: 'Email Address', type: 'email' },
            { name: 'status', label: 'Status', type: 'select', options: ['Confirmed', 'Active', 'Accepted', 'Cancelled'] },
          ]}
          cancelButtonText="Cancel"
          submitButtonText="Create Account"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
 
  );
};

export default AddAccounts;
