import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const EvaluateDE = () => {
    const {uniId,criteriaId} = useParams();

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
                name: "Evaluate DE",
                link: "/PG_Assignments/Conduct_DE/"+uniId+"/"+criteriaId
            }
        ]
    );

  return (
    <>
    <div>
      Evaluate DE {uniId} , {criteriaId}
    </div>
    </>
  )
}

export default EvaluateDE
