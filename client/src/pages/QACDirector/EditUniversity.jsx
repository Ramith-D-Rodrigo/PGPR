import React from 'react';
import { useParams } from 'react-router-dom';

function EditUniversity() {
    const { id } = useParams();
  return (
    <div>EditUniversity id: {id}</div>
  )
}

export default EditUniversity