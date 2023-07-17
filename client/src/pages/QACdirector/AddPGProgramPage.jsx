import React from 'react';
import Form from '../../components/Form';
import MainContent from '../../components/MainContent';
import ScrollableDiv from '../../components/ScrollableDiv';


const AddPGProgramPage = () => {
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
   
    <ScrollableDiv height="600px">
      <Form
        topic="Add PG Program"
        fields={[
          { name: 'university', label: 'University Name', type: 'text' },
          { name: 'faculty', label: 'Faculty/University Name', type: 'text' },
          { name: 'MgtUnit', label: 'PGPR Management Unit', type: 'text' },
          { name: 'pgprname', label: 'PGPR Name', type: 'text' },
          { name: 'startdate', label: 'Application Start Date', type: 'date'},
          { name: 'subdate', label: 'Submission Date', type: 'date'},
          { name: 'programCoordinator', label: 'Program Coordinator', type: 'text' },
          { name: 'deanDirector', label: 'Dean/Director', type: 'text' },
          { name: 'number', label: 'Phone', type: 'number' },
          { name: 'slqfLevels', label: 'SLQF Level', type: 'text' },
        ]}
        cancelButtonText="Cancel"
        submitButtonText="Add"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </ScrollableDiv>
    
  );
};

export default AddPGProgramPage;
