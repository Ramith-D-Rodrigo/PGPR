import React from "react";
import MainContent from "../../components/MainContent";
import ScrollableDiv from "../../components/ScrollableDiv";
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { Link } from "react-router-dom";

const CustomTable = ({ tableData }) => {
  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#D8E6FC" }}>
              <TableRow>
                <TableCell align="center">
                  <b>Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Designation</b>
                </TableCell>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
                <TableCell align="center">
                  <b>List of Criterias</b>
                </TableCell>
                <TableCell align="center">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.name}</TableCell>
                  <TableCell align="center">{row.designation}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">{row.criterias}</TableCell>
                  <TableCell align="center">
                    <Link to={"/edit/" + row.name}>
                      <Button
                        style={{ margin: "0 8px" }}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>
                    </Link>
                    <Link to={"/view/" + row.name}>
                      <Button
                        style={{ margin: "0 8px" }}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        View
                      </Button>
                    </Link>
                    <Link to={"/add/" + row.name}>
                      <Button
                        style={{ margin: "0 8px" }}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Add
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

const SetDateForm = () => {
  useSetUserNavigations([
    {
      name: "SetCriteria",
      link: "/SetCriteria"
    },
  ]);

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
          <label htmlFor="pgProgram" className="block font-medium text-gray-700">
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
          <label htmlFor="university" className="block font-medium text-gray-700">
            University Name:
          </label>
          <input
            type="text"
            id="university"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>

        <div>
          <label htmlFor="properEvalStart" className="block font-medium text-gray-700">
            Proper Evaluation Start:
          </label>
          <input
            type="date"
            id="properEvalStart"
            className="form-input border border-black p-1 w-full" // Add border and padding styles
          />
        </div>
        <div>
          <label htmlFor="properEvalEnd" className="block font-medium text-gray-700">
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
  ];

  return (
    <ScrollableDiv height="600px">
      <SetDateForm />
      <CustomTable tableData={tableData} />
    </ScrollableDiv>
  );
};

export default SetCriteria;
