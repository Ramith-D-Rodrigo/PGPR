import React from 'react';
import Form from '../../components/Form';
import ScrollableDiv from '../../components/ScrollableDiv';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';


const SubmitConsent = () => {
  useSetUserNavigations(
    [
        {
          name: "Submit Consent Letter",
          link: "/SubmitConsent"
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

  // Additional Content
  const additionalContent = (
    <div>
      {/* Additional content for Nominated chair and Reviewer */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-center">Nominated Chair and Reviewer</h2>
        <hr className="border-t-2 border-black my-4 opacity-50" />
        <div className="flex">
          <div className="flex-1">
            <label htmlFor="chair" className="block font-medium text-gray-700">
              Chair:
            </label>
            <input
              type="text"
              id="chair"
              className="form-input border border-black p-1 w-full" // Add border and padding styles
            />
          </div>
          <div className="flex-1 ml-4">
            <label htmlFor="reviewer1" className="block font-medium text-gray-700">
              Reviewer 1:
            </label>
            <input
              type="text"
              id="reviewer1"
              className="form-input border border-black p-1 w-full" // Add border and padding styles
            />
          </div>
          <div className="flex-1 ml-4">
            <label htmlFor="reviewer2" className="block font-medium text-gray-700">
              Reviewer 2:
            </label>
            <input
              type="text"
              id="reviewer2"
              className="form-input border border-black p-1 w-full" // Add border and padding styles
            />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex-1">
            <label className="font-medium text-gray-700 flex items-center">
              <input type="checkbox" className="w-5 h-5 text-blue-600 mr-2 border border-black rounded focus:ring-1 focus:ring-blue-600" /> Agree with nomination
            </label>
          </div>
          <div className="flex-1">
            <label className="font-medium text-gray-700 flex items-center">
              <input type="checkbox" className="w-5 h-5 text-blue-600 mr-2 border border-black rounded focus:ring-1 focus:ring-blue-600" /> Do not agree with nomination
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="remarks" className="block font-medium text-gray-700">
            Remarks:
          </label>
          <textarea
            id="remarks"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
      </div>
      <div className="my-10"> {/* Add margin */}
        {/* You can add your custom buttons here if needed */}
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
          { name: 'pgId', label: 'PGPR - ID', type: 'text' },
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

export default SubmitConsent;
