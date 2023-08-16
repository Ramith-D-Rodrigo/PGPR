import React, { useEffect } from 'react'
import ScrollableDiv from '../../components/ScrollableDiv'
import FormField from '../../components/FormField';
import CQADirectorForm from './CQADirectorForm';
import ViceChancellorForm from './ViceChancellorForm';
import UserDetailsForm from './UserDetailsForm';
import { Divider } from '@mui/material';
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import axios from '../../api/api.js';

const CreateAccounts = () => {

    const [role, setRole] = React.useState("vice_chancellor");

    let formData = null;

    const selectRole = (e) => {
        setRole(e.target.value);
    }

    const handleVCSubmit = (e) => {
        axios.post(SERVER_URL + SERVER_API_VERSION + "viceChancellors", formData)
            .then(res => {
                console.log(res.data);
            }
        )
    }

    const handleCQASubmit = (e) => {
        axios.post(SERVER_URL + SERVER_API_VERSION + "cqaDirectors", formData)
            .then(res => {
                console.log(res.data);
            }
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //get the form data
        formData = new FormData(e.target);

        //convert contact no splitted by comma to array
        const contactNo = formData.get("contactNo").split(",");
        
        const contactArr = contactNo.map((contact) => contact.trim());
        formData.set("contactNo", JSON.stringify(contactArr));

        if(role === "vice_chancellor"){
            handleVCSubmit(e);
        }
        else{
            handleCQASubmit(e);
        }
    }


    return (
        <>
                <form style={{padding:"20px 40px"}} onSubmit={handleSubmit}>
                    <FormField label={"Account For"} type={"select"} key={"VCCQA"} options={[
                        {name: "vc", value: "vice_chancellor", label: "Vice Chancellor"},
                        {name: "cqa", value: "cqa_director", label: "CQA Director"},
                    ]} onChange={selectRole}/>
                    <Divider sx={{marginTop: "1rem", marginBottom: "1rem"}}/>
                    <UserDetailsForm roleFieldsComponent={role === "vice_chancellor" ? 
                            <ViceChancellorForm/> : <CQADirectorForm/>    
                        } 
                    />
                </form>
        </>
    )
}

export default CreateAccounts