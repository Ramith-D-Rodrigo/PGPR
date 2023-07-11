import React from 'react'
import MainLayout from '../../components/MainLayout';
import axios from 'axios';
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';

const Universities = () => {

    axios.get(SERVER_URL + SERVER_API_VERSION + '/universities')
    .then(res => {
        console.log(res.data);
    })


    return (
        <MainLayout></MainLayout>
    )
}

export default Universities