import React from 'react'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function PEProgress() {
    const {pgprId} = useParams();
    const {reviewerId} = useParams();

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
                name: "PE Progress",
                link: "/PG_Assignments/Conduct_PE/view_PE_progress/"+pgprId
            },
        ]
    );


    return (
        <div>PE Progress {pgprId} / {reviewerId}</div>
    )
}

export default PEProgress