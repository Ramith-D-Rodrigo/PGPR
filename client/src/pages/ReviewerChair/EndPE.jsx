import React from 'react'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function EndPE() {

  const {pgprId} = useParams();
  useSetUserNavigations(
    [
        {
          name: "PG Assignments",
          link: "/PG_Assignments"
        },
        {
            name: "PE",
            link: "/PG_Assignments/Conduct_PE/"+pgprId
        },
        {
          name: "Assigned Criteria",
          link: `/PG_Assignments/Conduct_PE/Assigned_criteria/${pgprId}`,
        },
        {
            name: "Finalize PE",
            link: "/PG_Assignments/Conduct_PE/Finalize_PE/"+pgprId
        },
        {
            name: "End PE",
            link: "/PG_Assignments/Conduct_PE/End_PE/"+pgprId
        }
    ]
  );

  return (
    <div>EndPE {pgprId}</div>
  )
}

export default EndPE