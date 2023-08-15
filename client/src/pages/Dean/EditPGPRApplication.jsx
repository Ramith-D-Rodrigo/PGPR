import React from 'react'
import { useParams } from 'react-router-dom'

function EditPGPRApplication() {

    const {pgprApplicationID} = useParams();
    return (
        <div>EditPGPRApplication {pgprApplicationID}</div>
    )
}

export default EditPGPRApplication