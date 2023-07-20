import React from "react";
import MainContent from "../../components/MainContent";
import ScrollableDiv from "../../components/ScrollableDiv";

const SetDateForm = () => {
  const handleSubmit = (formValues) => {
    // Handle form submission
    console.log(formValues);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md mt-6">
      <h2 className="text-2xl font-bold text-center">
        Nominated Chair and Reviewer
      </h2>
      <hr className="border-t-2 border-black my-4 opacity-50" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="pgProgram"
            className="block font-medium text-gray-700"
          >
            PG Program:
          </label>
          <input
            type="text"
            id="pgProgram"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div>
          <label htmlFor="pgprId" className="block font-medium text-gray-700">
            PGPR-ID:
          </label>
          <input
            type="text"
            id="pgprId"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div>
          <label htmlFor="faculty" className="block font-medium text-gray-700">
            Faculty:
          </label>
          <input
            type="text"
            id="faculty"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div>
          <label
            htmlFor="university"
            className="block font-medium text-gray-700"
          >
            University Name:
          </label>
          <input
            type="text"
            id="university"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>

        <div>
          <label
            htmlFor="properEvalStart"
            className="block font-medium text-gray-700"
          >
            Proper Evaluation Start:
          </label>
          <input
            type="date"
            id="properEvalStart"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div>
          <label
            htmlFor="properEvalEnd"
            className="block font-medium text-gray-700"
          >
            Proper Evaluation End:
          </label>
          <input
            type="date"
            id="properEvalEnd"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
      </div>
    </div>
  );
};

const Table = () => {
    const tableData = [
        {
          name: "Reviewer 1",
          designation: "Professor",
          status: "Chairman",
          criterias: "1, 2, 3",
          actions: "add , edit, view",
        },
        {
          name: "Reviewer 2",
          designation: "Professor",
          status: "Reviewer",
          criterias: "2, 3, 4",
          actions: "add, edit, view",
        },
        {
          name: "Reviewer 2",
          designation: "Senior Lecturer",
          status: "Reviewer",
          criterias: "5, 6, 7",
          actions: "add, edit, view",
        },
  ];
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-2 border-black">
          <thead>
            <tr >
              <th className="border border-black px-4 py-2">Name</th>
              <th className="border border-black px-4 py-2">Designation</th>
              <th className="border border-black px-4 py-2">Status</th>
              <th className="border border-black px-4 py-2">
                List of Criterias
              </th>
              <th className="border border-black px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td className="border border-black px-4 py-2 text-center">
                  {row.name}
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  {row.designation}
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  {row.status}
                </td>
                <td className="border border-black px-4 py-2 text-center">
                  {row.criterias}
                </td>
                <td className="border border-black px-4 py-2 text-center">
                <button className="mr-12 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="mr-12 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    View
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const SetCriteria = () => {
  return (
    <ScrollableDiv height="600px">
      <SetDateForm />
      <Table />
    </ScrollableDiv>
  );
};

export default SetCriteria;
