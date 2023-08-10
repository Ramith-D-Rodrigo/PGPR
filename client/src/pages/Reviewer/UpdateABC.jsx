import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function UpdateABC() {
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
                name: "Update parts ABC",
                link: "/PG_Assignments/Conduct_DE/UpdateABC/"+uniId
            },
        ]
    );
  return (
    <div>UpdateABC</div>
  )
}

export default UpdateABC