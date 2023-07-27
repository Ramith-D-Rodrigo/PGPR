import React from 'react'
import FormField from './FormField';

const TestForm = ({topic, fields, cancelButtonText, submitButtonText, onCancel, onSubmit}) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic
        const formData = new FormData(event.target);
        const formValues = Object.fromEntries(formData.entries());

        onSubmit(formValues).then((res) => {
            alert(res.data);
        });
    };

    const handleCancel = (event) => {
        event.preventDefault();
        // Handle cancel logic
        onCancel();
    };
    // uses the FormField Component to create single form field for each field in the fields array

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">{topic}</h2>
            <hr className="border-t-2 border-black my-4 opacity-50" />
            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <FormField key={field.name} label={field.label} name={field.name} type={field.type} isReadonly={field.isReadonly} options={field.options}/>
                )
                )}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="btn btn-secondary mr-2 bg-red-500 hover:bg-red-600 rounded-lg py-2 px-6 text-base font-bold border border-red-700"
                        onClick={handleCancel}
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary bg-green-500 hover:bg-green-600 rounded-lg py-2 px-6 text-base font-bold border border-green-700"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default TestForm