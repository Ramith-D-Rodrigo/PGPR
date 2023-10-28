import { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard";
import getAllPostGraduatePrograms from "../../api/PostGraduateProgram/getAllPostGraduatePrograms"; // Import your API function

function CQADashboard() {
  const [contents, setContents] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    document.title = "CQA Director Dashboard";
    // Make an API request to fetch PG programs
    getAllPostGraduatePrograms({
      includeAcademicStaff: true,
      includeUniversitySide: true,
      includeUser: true,
      includeUniversity: true,
    })
      .then((response) => {
        // Set the PG program data into the tableData state
        setTableData(response.data);
        // Get the count of PG programs
        const programCount = response.data.length;

        // Create an updated contents array with the program count
        const data = [
          {
            title: "No of PG Programs Added",
            content: "2023 Mar 30 - 2023 July 30",
            message: `${programCount} PG Programs`, // Include the program count
          },
          {
            title: 'No of Accounts Added',
            content: '2023 Mar 30 - 2023 July 30',
            message: '2 Accounts',
          },
          {
            title: 'No.of Ongoing PGPR',
            content: '2023 Mar 30 - 2023 Jult 30',
            message: '2 PGPRs',
          },
          {
            title: 'Total Programs',
            content: '2023 Mar 30 - 2023 Jult 30',
            message: '3 days more',
          },
          {
            title: 'No.of Postgraduate Programs Review',
            content: '2023 Mar 30 - 2023 Jult 30',
            message: '1 PG Programmes',
          },
          {
            title: 'Requested Applications',
            content: '2023 Mar 30 - 2023 Jult 30',
            message: '1 PG Programmes',
          },
        ];
        setContents(data);
      })
      .catch((error) => {
        console.error("Error fetching PG programs", error);
      });
  }, []); 

  return <Dashboard contents={contents} />;
}

export default CQADashboard;
