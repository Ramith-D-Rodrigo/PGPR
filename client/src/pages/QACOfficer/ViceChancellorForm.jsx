import React from 'react';
import UserDetailsForm from './UserDetailsForm';
import FormField from '../../components/FormField';
import { Button, ButtonBase } from '@mui/material';
import axios from 'axios';
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';

const ViceChancellorForm = () => {

    const formFields = [
        {label: "Appointed Date", type: "date", name: "appointedDate"},
        {label: "Term Date", type: "date", name: "termDate"},
    ];

    return (
        <>
            {formFields.map((field, index) => (
                <FormField key={index} label={field.label} type={field.type} name={field.name} options={field.options} isReadonly={field.isReadOnly}/>
            ))}
        </>
    )
}

export default ViceChancellorForm