import React from 'react';
import Button from '@mui/material/Button';

const Form = ({ topic, fields, cancelButtonText, submitButtonText, onCancel, onSubmit, additionalContent  }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());
    onSubmit(formValues);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    // Handle cancel logic
    onCancel();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">{topic}</h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="mb-4 flex items-center">
            <label htmlFor={field.name} className="block w-48 font-medium text-gray-700">
              {field.label}
            </label>
            {field.name === 'title' ? (
              <div className="relative flex-grow">
                <select
                  id={field.name}
                  name={field.name}
                  className="form-select block w-full h-10 bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1 pr-8"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : field.name === 'status' ? (
              <div className="relative flex-grow">
                <select
                  id={field.name}
                  name={field.name}
                  className="form-select block w-full h-10 bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1 pr-8"
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                className="form-input flex-grow h-30 resize-none bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1"
              />
            ) : field.name === 'programCoordinator' || field.name === 'deanDirector' ? (
              <div className="relative flex-grow">
                <select
                  id={field.name}
                  name={field.name}
                  className="form-select block w-full h-10 bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1 pr-8"
                >
                  <option value="">Select {field.label}</option>
                  {field.name === 'programCoordinator' ? (
                    <>
                      <option value="professor1">Professor 1</option>
                      <option value="professor2">Professor 2</option>
                      <option value="professor3">Professor 3</option>
                    </>
                  ) : field.name === 'deanDirector' ? (
                    <>
                      <option value="professor4">Professor 4</option>
                      <option value="professor5">Professor 5</option>
                      <option value="professor6">Professor 6</option>
                    </>
                  ) : null}
                </select>
                
              </div>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                className="form-input flex-grow h-10 bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1"
              />
            )}
          </div>
        ))}
        {/* Additional Content */}
        {additionalContent}
        <div className="flex justify-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCancel}
            style={{ marginRight: '16px' }}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
