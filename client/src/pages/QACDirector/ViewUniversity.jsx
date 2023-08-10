import React from 'react';
import { useParams } from 'react-router-dom';

const ViewUniversity = () => {
    const { id } = useParams();
  return (
    <div>
      View Uni id : {id}
    </div>
  )
}

export default ViewUniversity
