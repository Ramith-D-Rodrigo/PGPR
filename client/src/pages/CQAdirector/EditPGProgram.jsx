import React from 'react';
import Form from '../../components/Form';
import MainContent from '../../components/MainContent';
import ScrollableDiv from '../../components/ScrollableDiv';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const EditPGProgram = () => {

  useSetUserNavigations(
    [
        {
          name: "Edit PG Program Details",
          link: "/AddPGProgramPage"
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
    <ScrollableDiv height="600px">
      <Form
        topic="Edit PG Program Application Details"
        fields={[
            { name: 'university', label: 'University Name', type: 'text' },
            { name: 'faculty', label: 'Faculty/Institute Name', type: 'text' },
            { name: 'MgtUnit', label: 'PGPR Management Unit', type: 'text' },
            { name: 'pgprname', label: 'PGPR Name', type: 'text' },
            { name: 'programCoordinator', label: 'Program Coordinator', type: 'text' },
            { name: 'deanDirector', label: 'Dean/Director', type: 'text' },
            { name: 'startdate', label: 'Application Start Date', type: 'date' },
            { name: 'year1', label: 'Year 1 (Y1)', type: 'text' },
            { name: 'year2', label: 'Year 2 (Y2)', type: 'text' },
            { name: 'year3', label: 'Year 3 (Y3)', type: 'text' },
            { name: 'year4', label: 'Year 4 (Y4)', type: 'text' },
            { name: 'year5', label: 'Year 5 (Y5)', type: 'text' },
            { name: 'enddate', label: 'End Date', type: 'date' },
            { name: 'evidences', label: 'Evidences', type: 'textarea' },
          ]}
        cancelButtonText="Cancel"
        submitButtonText="Update Application"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
      
    </ScrollableDiv>
  );
};

export default EditPGProgram;
