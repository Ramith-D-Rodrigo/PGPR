import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function Standardwise_details() {
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
                name: "Standard Wise Details",
                link: "/PG_Assignments/Conduct_DE/Standardwise_details/"+uniId
            },
        ]
    );
  return (
    <div>Standardwise_details</div>
  )
}

export default Standardwise_details