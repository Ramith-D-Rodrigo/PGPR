import MainContent from "../../components/MainContent";
import ScrollableDiv from "../../components/ScrollableDiv";
import Table from "../../components/Table";


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

const SetCriteria = () => {
  const tableData = [
    {
      name: "Reviewer 1",
      designation: "Professor",
      status: "Chairman",
      criterias: "1, 2, 3",
    },
    {
      name: "Reviewer 2",
      designation: "Professor",
      status: "Reviewer",
      criterias: "2, 3, 4",
    },
    {
      name: "Reviewer 2",
      designation: "Senior Lecturer",
      status: "Reviewer",
      criterias: "5, 6, 7",
    },
    // Add more data here if needed
  ];

  const tableColumns = [
    { header: "Name", dataKey: "name" },
    { header: "Designation", dataKey: "designation" },
    { header: "Status", dataKey: "status" },
    { header: "List of Criterias", dataKey: "criterias" },
    {
      header: "Actions",
      buttons: [
        { label: "Add", color: "red", onClick: () => console.log("Add clicked") },
        { label: "Edit", color: "blue", onClick: () => console.log("Edit clicked") },
        { label: "View", color: "green", onClick: () => console.log("View clicked") },
        // Add more buttons as needed
      ],
    },
  ];

  return (
    <ScrollableDiv height="600px">
      <SetDateForm />
      <Table columns={tableColumns} data={tableData} />
    </ScrollableDiv>
  );
};

export default SetCriteria;