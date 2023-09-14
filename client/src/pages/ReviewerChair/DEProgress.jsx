import React from 'react'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import { useParams } from 'react-router-dom';

function DEProgress() {
    const {pgprId} = useParams();
    const {reviewerId} = useParams();

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
                name: "DE Progress",
                link: "/PG_Assignments/Conduct_DE/view_DE_progress/"+pgprId
            },
        ]
    );


    return (
        <div>DE_progress {pgprId} / {reviewerId}</div>
    )
}

export default DEProgress