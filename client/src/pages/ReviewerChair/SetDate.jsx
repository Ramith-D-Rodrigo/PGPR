import React from 'react';
import Form from '../../components/Form';
import ScrollableDiv from '../../components/ScrollableDiv';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const SetDate = () => {
  /*
  * * all pages should do this
  */
  useSetUserNavigations(
    [
      {
        name: "SetDate",
        link: "/SetDate"
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
    <div className="mt-6">
   
      {/* Row 1: Desk Evaluation Start and Desk Evaluation End */}
      <div className="flex items-center mb-4">
        <div className="flex-1 mr-4">
          <label htmlFor="destart" className="block font-medium text-gray-700">
            Desk Evaluation Start:
          </label>
          <input
            type="date"
            id="destart"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div className="flex-1">
          <label htmlFor="deend" className="block font-medium text-gray-700">
            Desk Evaluation End:
          </label>
          <input
            type="date"
            id="deend"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
      </div>

      {/* Row 2: Proper Evaluation Start and Proper Evaluation End */}
      <div className="flex items-center mb-4">
        <div className="flex-1 mr-4">
          <label htmlFor="pestart" className="block font-medium text-gray-700">
            Proper Evaluation Start:
          </label>
          <input
            type="date"
            id="pestart"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div className="flex-1">
          <label htmlFor="peend" className="block font-medium text-gray-700">
            Proper Evaluation End:
          </label>
          <input
            type="date"
            id="peend"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div className="my-12"> {/* Add margin */}
        {/* You can add your custom buttons here if needed */}
      </div>
    </div>
      </div>
   
  );

  return (
    <div height="auto">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-md">
        <Form
          topic="Set Dates for Desk Evaluation and Proper Evaluation"
          fields={[]} // Add an empty array since we don't need any fields in the main form
          additionalContent={additionalContent}
          cancelButtonText="Cancel"
          submitButtonText="Add Dates"
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SetDate;
