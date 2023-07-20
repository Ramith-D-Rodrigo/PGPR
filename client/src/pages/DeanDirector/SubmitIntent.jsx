import React from 'react';
import Form from '../../components/Form';
import MainContent from '../../components/MainContent';
import ScrollableDiv from '../../components/ScrollableDiv';

const SubmitIntent = () => {
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

  // Additional Content
  const additionalContent = (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Consent Letter for Program Review</h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <p className=" text-center mt-4 mb-8">
        It’s happy to inform you that we would like to submit our consent letter to carry out the PG PR given above.
        The signed letter is uploaded to confirm our consent.
      </p>
      <div className="flex justify-center items-center mt-4">
        <label className="block w-48 font-medium text-gray-700">
          Select Letter of Intent :
        </label>
        <input
          type="file"
          className="form-input mt-1 ml-0.5"
          // Add any necessary attributes for file upload
        />
      </div>
    </div>
  );

  return (
    <ScrollableDiv height="600px">
      <Form
        topic="Submit the Letter of Intent to PG Program Review"
        fields={[
          { name: 'university', label: 'University Name', type: 'text' },
          { name: 'faculty', label: 'Faculty/University Name', type: 'text' },
          { name: 'pgprogram', label: 'PG Program Name', type: 'text' },
          { name: 'programCoordinator', label: 'Program Coordinator', type: 'text' },
          { name: 'slqfLevels', label: 'SLQF Level', type: 'text' },
          { name: 'startdate', label: 'Application Start Date', type: 'date' },
        ]}
        additionalContent={additionalContent}
        cancelButtonText="Cancel"
        submitButtonText="Submit Letter"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </ScrollableDiv>
  );
};

export default SubmitIntent;
