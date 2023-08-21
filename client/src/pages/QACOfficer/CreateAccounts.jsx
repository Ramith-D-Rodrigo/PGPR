import React, { useEffect } from 'react'
import ScrollableDiv from '../../components/ScrollableDiv'
import FormField from '../../components/FormField';
import CQADirectorForm from './CQADirectorForm';
import ViceChancellorForm from './ViceChancellorForm';
import UserDetailsForm from './UserDetailsForm';
import { Divider, Typography } from '@mui/material';
import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import { Snackbar, Alert, CircularProgress, Button, Box } from '@mui/material';
import axios from '../../api/api.js';
import { useNavigate } from 'react-router-dom';

const CreateAccounts = () => {

    const navigate = useNavigate();
    const [role, setRole] = React.useState("vice_chancellor");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [success, setSuccess] = React.useState(false);
    const [Loading, setLoading] = React.useState(false);

    let formData = null;

    const selectRole = (e) => {
        setRole(e.target.value);
    }

    const handleVCSubmit = async(e) => {
        errorMsg && setErrorMsg("");
        setLoading(true);
        axios.post(SERVER_URL + SERVER_API_VERSION + "viceChancellors", formData)
            .then(res => {
                console.log(res.data);
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    navigate("../");
                }, 1500);
            }
        ).catch(err => {
            console.log(err);
            setErrorMsg(err?.response?.data?.message);
            setLoading(false);
        })
    }

    const handleCQASubmit = async(e) => {
        errorMsg && setErrorMsg("");
        setLoading(true);
        axios.post(SERVER_URL + SERVER_API_VERSION + "cqaDirectors", formData)
            .then(res => {
                console.log(res.data);
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    navigate("../");
                }, 1500);
            }
        ).catch(err => {
            console.log(err);
            setErrorMsg(err?.response?.data?.message);
            setLoading(false);
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
                    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
                        <FormField required={true} label={"Account For"} type={"select"} key={"VCCQA"} options={[
                            {name: "vc", value: "vice_chancellor", label: "Vice Chancellor"},
                            {name: "cqa", value: "cqa_director", label: "CQA Director"},
                        ]} onChange={selectRole}/>
                    </Box>
                    <Divider sx={{marginTop: "1rem", marginBottom: "1rem"}}/>
                    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap"}}>
                        <UserDetailsForm Loading={Loading} roleFieldsComponent={role === "vice_chancellor" ? 
                                <ViceChancellorForm/> : <CQADirectorForm/>    
                            } 
                        />
                    </Box>
                    {/* <Box sx={{margin:"0.5rem 0",display:'flex',flexWrap:"wrap",justifyContent:'center',alignItems:'center',width:'100%'}}>
                        {Loading? "Processing " : ""}
                        {Loading && <CircularProgress style={{margin:"0 0.5rem"}} color="primary" size={24} />}
                    </Box> */}
                </form>

                <Snackbar
                    open={errorMsg == "" ? false : true}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    onClose={() => setErrorMsg("")}
                >
                    <Alert onClose={() => setErrorMsg("")} severity="error">
                        {errorMsg}
                    </Alert>
                </Snackbar>

                <Snackbar
                    open={success}
                    autoHideDuration={1500}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setSuccess(false)} severity="success">
                        Created Successfully!
                    </Alert>
                </Snackbar>
        </>
    )
}

export default CreateAccounts