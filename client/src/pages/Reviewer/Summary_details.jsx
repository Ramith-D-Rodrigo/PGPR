import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function Summary_details() {
    const {uniId} = useParams();
    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "DE",
                link: "/PG_Assignments/Conduct_DE/"+uniId
            },
            {
                name: "Summary Details",
                link: "/PG_Assignments/Conduct_DE/Summary_details/"+uniId
            },
        ]
    );
  return (
    <div>Summary_details</div>
  )
}

export default Summary_details