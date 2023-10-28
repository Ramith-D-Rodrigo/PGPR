import React from 'react'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function EndDE() {
  const {pgprId} = useParams();

  useSetUserNavigations(
    [
        {
          name: "PG Assignments",
          link: "/PG_Assignments"
        },
        {
            name: "DE",
            link: "/PG_Assignments/Conduct_DE/"+pgprId
        },
        {
            name: "Finalize DE",
            link: "/PG_Assignments/Conduct_DE/Finalize_DE/"+pgprId
        },
        {
            name: "End DE",
            link: "/PG_Assignments/Conduct_DE/End_DE/"+pgprId
        },
    ]
  );

  return (
    <div>EndDE {pgprId}</div>
  )
}

export default EndDE