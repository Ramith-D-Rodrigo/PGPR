import { SERVER_API_VERSION, SERVER_URL } from '../../assets/constants';
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select, Snackbar, Alert, Box, Divider, Chip } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText';
import axios from '../../api/api.js';
import { useState, useEffect } from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

function AddFaculty() {
    useSetUserNavigations(
        [
            {
                name: "Dashboard",
                link: "/"
            },
            {
                name: "Faculties",
                link: "/faculties"
            },
            {
                name: "Add Faculty",
                link: "/faculties/add"
            }
        ]
    );

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [facultyName, setFacultyName] = useState('');
    const [facultyNameError, setFacultyNameError] = useState({ err: { error: false }, msg: '' });
    const [facultyWebsite, setFacultyWebsite] = useState('');
    const [facultyWebsiteError, setFacultyWebsiteError] = useState({ err: { error: false }, msg: '' });
    const [facultyAddress, setFacultyAddress] = useState('');
    const [facultyAddressError, setFacultyAddressError] = useState({ err: { error: false }, msg: '' });
    const [iqauEmail, setIqauEmail] = useState('');
    const [iqauEmailError, setIqauEmailError] = useState({ err: { error: false }, msg: '' });
    const [facultyContactNumbers, setFacultyContactNumbers] = useState({ numbers: [''], errMsgs: [{ err: { error: false }, msg: '' },] });
    const [facultyFaxNumbers, setFacultyFaxNumbers] = useState({ numbers: [''], errMsgs: [{ err: { error: false }, msg: '' },] });
    const [iqauFaxNumbers, setIqauFaxNumbers] = useState({ numbers: [''], errMsgs: [{ err: { error: false }, msg: '' },] });
    const [iqauContactNumbers, setIqauContactNumbers] = useState({ numbers: [''], errMsgs: [{ err: { error: false }, msg: '' },] });
    const [iqauAddress, setIqauAddress] = useState('');
    const [iqauAddressError, setIqauAddressError] = useState({ err: { error: false }, msg: '' });
    const [added, setAdded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');

    // console.log(facultyContactNumbers);

    useEffect(() => {
        document.title = 'Add Faculty | QAC'
    }, []);


    useEffect(() => {
        setFacultyNameError({ err: { error: false }, msg: '' });
        setFacultyWebsiteError({ err: { error: false }, msg: '' });
        setFacultyAddressError({ err: { error: false }, msg: '' });
        setIqauEmailError({ err: { error: false }, msg: '' });
        setFacultyContactNumbers((prev) => {
            let errArr = [];
            for (let i = 0; i < prev.numbers.length; i++) {
                errArr.push({ err: { error: false }, msg: '' });
            }
            return { numbers: prev.numbers, errMsgs: errArr }
        });
        setFacultyFaxNumbers((prev) => {
            let errArr = [];
            for (let i = 0; i < prev.numbers.length; i++) {
                errArr.push({ err: { error: false }, msg: '' });
            }
            return { numbers: prev.numbers, errMsgs: errArr }
        });
        setIqauFaxNumbers((prev) => {
            let errArr = [];
            for (let i = 0; i < prev.numbers.length; i++) {
                errArr.push({ err: { error: false }, msg: '' });
            }
            return { numbers: prev.numbers, errMsgs: errArr }
        });
        setIqauContactNumbers((prev) => {
            let errArr = [];
            for (let i = 0; i < prev.numbers.length; i++) {
                errArr.push({ err: { error: false }, msg: '' });
            }
            return { numbers: prev.numbers, errMsgs: errArr }
        });
    }, [facultyName, facultyWebsite, facultyAddress, iqauEmail,]);

    const handleClickAddFaculty = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFacultyNameError({ err: { error: false }, msg: '' });
        setFacultyWebsiteError({ err: { error: false }, msg: '' });
        setFacultyAddressError({ err: { error: false }, msg: '' });
        setIqauEmailError({ err: { error: false }, msg: '' });

        // setFacultyContactNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setFacultyFaxNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setIqauFaxNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setIqauContactNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });

        // console.log(facultyName);
        if (facultyName === '') {
            setFacultyNameError({ err: { error: true }, msg: 'Faculty Name is required' });
            console.log("uni name :  ", facultyName);
            setLoading(false);
            return;
        }
        else if (facultyAddress === '') {
            setFacultyAddressError({ err: { error: true }, msg: 'Faculty Address is required' });
            setLoading(false);
            return;
        }
        else if (facultyWebsite === '') {
            setFacultyWebsiteError({ err: { error: true }, msg: 'Faculty Website is required' });
            setLoading(false);
            return;
        }
        else if (iqauEmail === '') {
            setIqauEmailError({ err: { error: true }, msg: 'Iqau Email is required' });
            setLoading(false);
            return;
        }
        else if (facultyContactNumbers.numbers.includes('')) {
            setFacultyContactNumbers((prev) => {
                let errArr = [];
                for (let i = 0; i < prev.numbers.length; i++) {
                    if (prev.numbers[i] === '') {
                        errArr.push({ err: { error: true }, msg: 'Contact Number is required' });
                    }
                    else {
                        errArr.push({ err: { error: false }, msg: '' });
                    }
                }
                return { numbers: prev.numbers, errMsgs: errArr }
            });
            setLoading(false);
            return;
        }
        else if (facultyFaxNumbers.numbers.includes('')) {
            setFacultyFaxNumbers((prev) => {
                let errArr = [];
                for (let i = 0; i < prev.numbers.length; i++) {
                    if (prev.numbers[i] === '') {
                        errArr.push({ err: { error: true }, msg: 'Fax Number is required' });
                    }
                    else {
                        errArr.push({ err: { error: false }, msg: '' });
                    }
                }
                return { numbers: prev.numbers, errMsgs: errArr }
            });
            setLoading(false);
            return;
        }
        else if (iqauContactNumbers.numbers.includes('')) {
            setIqauContactNumbers((prev) => {
                let errArr = [];
                for (let i = 0; i < prev.numbers.length; i++) {
                    if (prev.numbers[i] === '') {
                        errArr.push({ err: { error: true }, msg: 'Contact Number is required' });
                    }
                    else {
                        errArr.push({ err: { error: false }, msg: '' });
                    }
                }
                return { numbers: prev.numbers, errMsgs: errArr }
            });
            setLoading(false);
            return;
        }
        else if (iqauFaxNumbers.numbers.includes('')) {
            setIqauFaxNumbers((prev) => {
                let errArr = [];
                for (let i = 0; i < prev.numbers.length; i++) {
                    if (prev.numbers[i] === '') {
                        errArr.push({ err: { error: true }, msg: 'Fax Number is required' });
                    }
                    else {
                        errArr.push({ err: { error: false }, msg: '' });
                    }
                }
                return { numbers: prev.numbers, errMsgs: errArr }
            });
            setLoading(false);
            return;
        }
        else {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post(SERVER_URL + SERVER_API_VERSION + 'faculties/',
                {
                    name: facultyName,
                    website: facultyWebsite,
                    address: facultyAddress,
                    contactNo: {
                        data: facultyContactNumbers.numbers,
                    },
                    faxNo: {
                        data: facultyFaxNumbers.numbers,
                    },
                    iqauAddress: iqauAddress,
                    iqauContactNo: {
                        data: iqauContactNumbers.numbers,
                    },
                    iqauFaxNo: {
                        data: iqauFaxNumbers.numbers,
                    },
                    iqauEmail: iqauEmail,
                }
            ).then(res => {
                console.log(res.data);
                setResponseMsg(res.statusText);
                setAdded(true);
                setLoading(false);
                setTimeout(() => {
                    navigate('../', { replace: true });
                }, 1000);
            })
                .catch(err => {
                    console.log("message : ", err?.response?.data?.message);
                    console.log("errors : ", err?.response?.data?.errors);
                    setResponseMsg(err?.response?.data?.message);
                    setFailed(true);
                    setLoading(false);
                });
        }
    }

    const handleAddUniContactNumber = (index) => {
        setFacultyContactNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return { numbers: [...prev.numbers, ''], errMsgs: [...errArr, { err: { error: false }, msg: '' }] }
        })
    }

    const handleRemoveUniContactNumber = (index) => {
        setFacultyContactNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return { numbers: prev.numbers.filter((item, i) => i !== index), errMsgs: prev.errMsgs.filter((item, i) => i !== index) }
        })
    }

    const handleAddUniFaxNumber = (index) => {
        setFacultyFaxNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return { numbers: [...prev.numbers, ''], errMsgs: [...errArr, { err: { error: false }, msg: '' }] }
        })
    }

    const handleRemoveUniFaxNumber = (index) => {
        setFacultyFaxNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return { numbers: prev.numbers.filter((item, i) => i !== index), errMsgs: prev.errMsgs.filter((item, i) => i !== index) }
        })
    }

    const handleAddIqauContactNumber = (index) => {
        setIqauContactNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return { numbers: [...prev.numbers, ''], errMsgs: [...errArr, { err: { error: false }, msg: '' }] }
        })
    }

    const handleRemoveIqauContactNumber = (index) => {
        setIqauContactNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return { numbers: prev.numbers.filter((item, i) => i !== index), errMsgs: prev.errMsgs.filter((item, i) => i !== index) }
        })
    }

    const handleAddIqauFaxNumber = (index) => {
        setIqauFaxNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return { numbers: [...prev.numbers, ''], errMsgs: [...errArr, { err: { error: false }, msg: '' }] }
        })
    }

    const handleRemoveIqauFaxNumber = (index) => {
        setIqauFaxNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return { numbers: prev.numbers.filter((item, i) => i !== index), errMsgs: prev.errMsgs.filter((item, i) => i !== index) }
        })
    }

    return (
        <>
            <Divider textAlign='left'>
                <Chip label="Add Faculty" />
            </Divider>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', marginTop: '2rem' }}>
                <form style={{ display: "flex", flexWrap: 'wrap', width: '90%', justifyContent: 'center', alignItems: 'flex-start' }} onSubmit={handleClickAddFaculty}>
                    <FormControl sx={{ padding: "15px 10px", width: '50%', boxSizing: 'border-box' }} {...facultyNameError.err} variant="standard">
                        <InputLabel htmlFor="faculty-name"><b>Faculty Name</b></InputLabel>
                        <Input
                            required
                            // autoComplete='off'
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value)}
                            id="facultyName"
                            aria-describedby="Faculty-name"
                            type='text'
                        />
                        {facultyNameError.err.error && <FormHelperText id="Faculty-name-error-text">{facultyNameError.msg}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ padding: "15px 10px", width: '50%', boxSizing: 'border-box' }} {...facultyAddressError.err} variant="standard">
                        <InputLabel htmlFor="Faculty-address"><b>Faculty Address</b></InputLabel>
                        <Input
                            required
                            // autoComplete='off'
                            value={facultyAddress}
                            onChange={(e) => setFacultyAddress(e.target.value)}
                            id="uniAddress"
                            type='text'
                            aria-describedby="Faculty-address"
                        />
                        {facultyAddressError.err.error && <FormHelperText id="Faculty-address-error-text">{facultyAddressError.msg}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ padding: "15px 10px", width: '50%', boxSizing: 'border-box' }} {...facultyWebsiteError.err} variant="standard">
                        <InputLabel htmlFor="Faculty-website"><b>Faculty Website</b></InputLabel>
                        <Input
                            required
                            // autoComplete='off'
                            value={facultyWebsite}
                            onChange={(e) => setFacultyWebsite(e.target.value)}
                            id="uniWebsite"
                            type='url'
                            aria-describedby="Faculty-website"
                        />
                        {facultyWebsiteError.err.error && <FormHelperText id="Faculty-website-error-text">{facultyWebsiteError.msg}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ padding: "15px 10px", width: '50%', boxSizing: 'border-box' }} {...iqauEmailError.err} variant="standard">
                        <InputLabel htmlFor="Iqau-email"><b>IQAU Email</b></InputLabel>
                        <Input
                            required
                            // autoComplete='off'
                            value={iqauEmail}
                            onChange={(e) => setIqauEmail(e.target.value)}
                            id="iqauEmail"
                            aria-describedby="Iqau-email"
                            type='email'
                        />
                        {iqauEmailError.err.error && <FormHelperText id="Iqau-email-error-text">{iqauEmailError.msg}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ padding: "15px 10px", width: '60%', boxSizing: 'border-box' }} {...iqauAddressError.err} variant="standard">
                        <InputLabel htmlFor="Iqau-address"><b>IQAU Address</b></InputLabel>
                        <Input
                            required
                            // autoComplete='off'
                            value={iqauAddress}
                            onChange={(e) => setIqauAddress(e.target.value)}
                            id="iqauAddress"
                            aria-describedby="Iqau-address"
                            type='text'
                        />
                        {iqauAddressError.err.error && <FormHelperText id="Iqau-address-error-text">{iqauAddressError.msg}</FormHelperText>}
                    </FormControl>

                    <div style={{ display: "flex", flexWrap: 'wrap', width: '100%', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <div style={{ width: '25%', margin: '10px 0' }}>
                            <InputLabel style={{ margin: '10px 0 20px' }} htmlFor="uni-contact-no"><b>Faculty Contact Number(s)</b></InputLabel>
                            {facultyContactNumbers.numbers.map((contactNumber, index) => {//console.log("contact number : ",index);
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                                        <FormControl sx={{ padding: "15px 5px", boxSizing: 'border-box' }} fullWidth {...facultyContactNumbers.errMsgs[index].err} variant="standard">
                                            <InputLabel sx={{ fontSize: "15px", padding: "0 0 0 10px" }} htmlFor="uni-contact-no">Contact Number {index + 1}</InputLabel>
                                            <Input
                                                required
                                                // autoComplete='off'
                                                type="number"
                                                value={contactNumber}
                                                onChange={
                                                    (e) => {
                                                        setFacultyContactNumbers((prev) => {
                                                            let errArr = prev.errMsgs;
                                                            return { numbers: prev.numbers.map((number, i) => i === index ? e.target.value : number), errMsgs: errArr }
                                                        })
                                                    }}
                                                id="uniContactNo"
                                                aria-describedby="uni-contact-no"
                                            />
                                            {facultyContactNumbers.errMsgs[index].err.error && <FormHelperText id="uni-contact-no">{facultyContactNumbers.errMsgs[index].msg}</FormHelperText>}

                                        </FormControl>
                                        {index !== 0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveUniContactNumber(index)} style={{ cursor: 'pointer', color: 'red', margin: '0 0 0 10px' }} />}
                                        {index === 0 && <AddCircleOutlineIcon onClick={() => handleAddUniContactNumber(index + 1)} style={{ cursor: 'pointer', color: 'green', margin: '0 0 0 10px' }} />}
                                    </div>
                                )
                            })
                            }

                        </div>

                        <div style={{ width: '25%', margin: '10px 0' }}   >
                            <InputLabel style={{ margin: '10px 0 20px' }} htmlFor="uni-contact-no"><b>Faculty Fax Number(s)</b></InputLabel>
                            {facultyFaxNumbers.numbers.map((FaxNumber, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                                        <FormControl sx={{ padding: "15px 5px", boxSizing: 'border-box' }} fullWidth {...facultyFaxNumbers.errMsgs[index].err} variant="standard">
                                            <InputLabel sx={{ fontSize: "15px", padding: "0 0 0 10px" }} htmlFor="uni-fax-no">Fax Number {index + 1}</InputLabel>
                                            <Input
                                                required
                                                // autoComplete='off'
                                                type="number"
                                                value={FaxNumber}
                                                onChange={
                                                    (e) => {
                                                        setFacultyFaxNumbers((prev) => {
                                                            let errArr = prev.errMsgs;
                                                            return { numbers: prev.numbers.map((number, i) => i === index ? e.target.value : number), errMsgs: errArr }
                                                        })
                                                    }}
                                                id="uniFaxNo"
                                                aria-describedby="uni-fax-no"
                                            />
                                            {facultyFaxNumbers.errMsgs[index].err.error && <FormHelperText id="uni-fax-no">{facultyFaxNumbers.errMsgs[index].msg}</FormHelperText>}

                                        </FormControl>
                                        {index !== 0 && index !== 0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveUniFaxNumber(index)} style={{ cursor: 'pointer', color: 'red', margin: '0 0 0 10px' }} />}
                                        {index === 0 && <AddCircleOutlineIcon onClick={() => handleAddUniFaxNumber(index + 1)} style={{ cursor: 'pointer', color: 'green', margin: '0 0 0 10px' }} />}
                                    </div>
                                )
                            })
                            }

                        </div>

                        <div style={{ width: '25%', margin: '10px 0' }}   >
                            <InputLabel style={{ margin: '10px 0 20px' }} htmlFor="Iqau-contact-no"><b>IQAU Contact Number(s)</b></InputLabel>
                            {iqauContactNumbers.numbers.map((contactNo, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                                        <FormControl sx={{ padding: "15px 5px", boxSizing: 'border-box' }} fullWidth {...iqauContactNumbers.errMsgs[index].err} variant="standard">
                                            <InputLabel sx={{ fontSize: "15px", padding: "0 0 0 10px" }} htmlFor="Iqau-contact-no">Contact Number {index + 1}</InputLabel>
                                            <Input
                                                required
                                                // autoComplete='off'
                                                type="number"
                                                value={contactNo}
                                                onChange={
                                                    (e) => {
                                                        setIqauContactNumbers((prev) => {
                                                            let errArr = prev.errMsgs;
                                                            return { numbers: prev.numbers.map((number, i) => i === index ? e.target.value : number), errMsgs: errArr }
                                                        })
                                                    }}
                                                id="IqauContactNo"
                                                aria-describedby="Iqau-contact-no"
                                            />
                                            {iqauContactNumbers.errMsgs[index].err.error && <FormHelperText id="Iqau-contact-no">{iqauContactNumbers.errMsgs[index].msg}</FormHelperText>}

                                        </FormControl>
                                        {index !== 0 && index !== 0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveIqauContactNumber(index)} style={{ cursor: 'pointer', color: 'red', margin: '0 0 0 10px' }} />}
                                        {index === 0 && <AddCircleOutlineIcon onClick={() => handleAddIqauContactNumber(index + 1)} style={{ cursor: 'pointer', color: 'green', margin: '0 0 0 10px' }} />}
                                    </div>
                                )
                            })
                            }

                        </div>

                        <div style={{ width: '25%', margin: '10px 0' }}   >
                            <InputLabel style={{ margin: '10px 0 20px' }} htmlFor="Iqau-fax-no"><b>IQAU Fax Number(s)</b></InputLabel>
                            {iqauFaxNumbers.numbers.map((FaxNumber, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                                        <FormControl sx={{ padding: "15px 5px", boxSizing: 'border-box' }} fullWidth {...iqauFaxNumbers.errMsgs[index].err} variant="standard">
                                            <InputLabel sx={{ fontSize: "15px", padding: "0 0 0 10px" }} htmlFor="Iqau-fax-no">Fax Number {index + 1}</InputLabel>
                                            <Input
                                                required
                                                // autoComplete='off'
                                                type="number"
                                                value={FaxNumber}
                                                onChange={
                                                    (e) => {
                                                        setIqauFaxNumbers((prev) => {
                                                            let errArr = prev.errMsgs;
                                                            return { numbers: prev.numbers.map((number, i) => i === index ? e.target.value : number), errMsgs: errArr }
                                                        })
                                                    }}
                                                id="IqauFaxNo"
                                                aria-describedby="Iqau-fax-no"
                                            />
                                            {iqauFaxNumbers.errMsgs[index].err.error && <FormHelperText id="Iqau-fax-no">{iqauFaxNumbers.errMsgs[index].msg}</FormHelperText>}

                                        </FormControl>
                                        {index !== 0 && index !== 0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveIqauFaxNumber(index)} style={{ cursor: 'pointer', color: 'red', margin: '0 0 0 10px' }} />}
                                        {index === 0 && <AddCircleOutlineIcon onClick={() => handleAddIqauFaxNumber(index + 1)} style={{ cursor: 'pointer', color: 'green', margin: '0 0 0 10px' }} />}
                                    </div>
                                )
                            })
                            }

                        </div>
                    </div>

                    {/* show errors */}
                    <Button style={{ margin: "20px 0 15px", width: '200px' }} type='submit' color='primary' variant="contained" fullWidth
                    >
                        {loading ? <CircularProgress thickness={6} color='secondary' size={24} /> : 'add'}
                    </Button>

                    <Snackbar
                        open={failed}
                        autoHideDuration={2000}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                        onClose={() => { setFailed(false); setResponseMsg('') }}
                    >
                        <Alert onClose={() => { setFailed(false); setResponseMsg(''); }} severity="error">
                            {responseMsg}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={added}
                        autoHideDuration={1000}
                        onClose={() => { setAdded(false); setResponseMsg('') }}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={() => { setAdded(false); setResponseMsg(''); }} severity="success">
                            {responseMsg}
                        </Alert>
                    </Snackbar>

                </form>
            </Box>
        </>
    )
}

export default AddFaculty