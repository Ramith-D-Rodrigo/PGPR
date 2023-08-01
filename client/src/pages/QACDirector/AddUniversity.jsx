import React from 'react'
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, InputLabel, MenuItem, Select,Snackbar,Alert, Box } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText';
import axios from '../../api/api.js';
import {useState,useEffect} from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';


function AddUniversity() {
    useSetUserNavigations(
        [
            {
                name: "Universities",
                link: "/universities"
            },
            {
                name: "Add University",
                link: "/universities/add"
            },
        ]
    );
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [universityName, setUniversityName] = useState('');
    const [universityNameError, setUniversityNameError] = useState({err:{error:false},msg:''});
    const [universityWebsite, setUniversityWebsite] = useState('');
    const [universityWebsiteError, setUniversityWebsiteError] = useState({err:{error:false},msg:''});
    const [universityAddress, setUniversityAddress] = useState('');
    const [universityAddressError, setUniversityAddressError] = useState({err:{error:false},msg:''});
    const [cqaEmail, setCqaEmail] = useState('');
    const [cqaEmailError, setCqaEmailError] = useState({err:{error:false},msg:''});
    const [uniContactNumbers, setUniContactNumbers] = useState({numbers:[''],errMsgs:[{err:{error:false},msg:''},]});
    const [uniFaxNumbers, setUniFaxNumbers] = useState({numbers:[''],errMsgs:[{err:{error:false},msg:''},]});
    const [cqaFaxNumbers, setCqaFaxNumbers] = useState({numbers:[''],errMsgs:[{err:{error:false},msg:''},]});
    const [cqaContactNumbers, setCqaContactNumbers] = useState({numbers:[''],errMsgs:[{err:{error:false},msg:''},]});
    const [added, setAdded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [responseMsg, setResponseMsg] = useState('');

    // console.log(uniContactNumbers);

    useEffect(() => {
        document.title = 'Add University | QAC'
    }, []);


    useEffect(() => {    
        setUniversityNameError({err:{error:false},msg:''});
        setUniversityWebsiteError({err:{error:false},msg:''});
        setUniversityAddressError({err:{error:false},msg:''});
        setCqaEmailError({err:{error:false},msg:''});
        setUniContactNumbers((prev) => {
            let errArr = [];
            for(let i=0;i<prev.numbers.length;i++)
            {
                errArr.push({err:{error:false},msg:''});
            }
            return {numbers:prev.numbers,errMsgs:errArr}
        });
        setUniFaxNumbers((prev) => {
            let errArr = [];
            for(let i=0;i<prev.numbers.length;i++)
            {
                errArr.push({err:{error:false},msg:''});
            }
            return {numbers:prev.numbers,errMsgs:errArr}
        });
        setCqaFaxNumbers((prev) => {
            let errArr = [];
            for(let i=0;i<prev.numbers.length;i++)
            {
                errArr.push({err:{error:false},msg:''});
            }
            return {numbers:prev.numbers,errMsgs:errArr}
        });
        setCqaContactNumbers((prev) => {
            let errArr = [];
            for(let i=0;i<prev.numbers.length;i++)
            {
                errArr.push({err:{error:false},msg:''});
            }
            return {numbers:prev.numbers,errMsgs:errArr}
        });
    }, [universityName,universityWebsite,universityAddress,cqaEmail,]);

    const handleClickAddUniversity = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUniversityNameError({err:{error:false},msg:''});
        setUniversityWebsiteError({err:{error:false},msg:''});
        setUniversityAddressError({err:{error:false},msg:''});
        setCqaEmailError({err:{error:false},msg:''});

        // setUniContactNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setUniFaxNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setCqaFaxNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });
        // setCqaContactNumbers((prev) => {
        //     let errArr = [];
        //     for(let i=0;i<prev.numbers.length;i++)
        //     {
        //         errArr.push({err:{error:false},msg:''});
        //     }
        //     return {numbers:prev.numbers,errMsgs:errArr}
        // });

        // console.log(universityName);
        if(universityName === '')
        {
            setUniversityNameError({err:{error:true},msg:'University Name is required'});
            console.log("uni name :  ",universityName);
            setLoading(false);
            return;
        }
        else if(universityAddress === '')
        {
            setUniversityAddressError({err:{error:true},msg:'University Address is required'});
            setLoading(false);
            return;
        }
        else if(universityWebsite === '')
        {
            setUniversityWebsiteError({err:{error:true},msg:'University Website is required'});
            setLoading(false);
            return;
        }
        else if(cqaEmail === '')
        {
            setCqaEmailError({err:{error:true},msg:'CQA Email is required'});
            setLoading(false);
            return;
        }
        else if(uniContactNumbers.numbers.includes(''))
        {
            setUniContactNumbers((prev) => {
                let errArr = [];
                for(let i=0;i<prev.numbers.length;i++)
                {
                    if(prev.numbers[i] === '')
                    {
                        errArr.push({err:{error:true},msg:'Contact Number is required'});
                    }
                    else{
                        errArr.push({err:{error:false},msg:''});
                    }
                }
                return {numbers:prev.numbers,errMsgs:errArr}
            });
            setLoading(false);
            return;
        }
        else if(uniFaxNumbers.numbers.includes(''))
        {
            setUniFaxNumbers((prev) => {
                let errArr = [];
                for(let i=0;i<prev.numbers.length;i++)
                {
                    if(prev.numbers[i] === '')
                    {
                        errArr.push({err:{error:true},msg:'Fax Number is required'});
                    }
                    else{
                        errArr.push({err:{error:false},msg:''});
                    }
                }
                return {numbers:prev.numbers,errMsgs:errArr}
            });
            setLoading(false);
            return;
        }
        else if(cqaContactNumbers.numbers.includes(''))
        {
            setCqaContactNumbers((prev) => {
                let errArr = [];
                for(let i=0;i<prev.numbers.length;i++)
                {
                    if(prev.numbers[i] === '')
                    {
                        errArr.push({err:{error:true},msg:'Contact Number is required'});
                    }
                    else{
                        errArr.push({err:{error:false},msg:''});
                    }
                }
                return {numbers:prev.numbers,errMsgs:errArr}
            });
            setLoading(false);
            return;
        }
        else if(cqaFaxNumbers.numbers.includes(''))
        {
            setCqaFaxNumbers((prev) => {
                let errArr = [];
                for(let i=0;i<prev.numbers.length;i++)
                {
                    if(prev.numbers[i] === '')
                    {
                        errArr.push({err:{error:true},msg:'Fax Number is required'});
                    }
                    else{
                        errArr.push({err:{error:false},msg:''});
                    }
                }
                return {numbers:prev.numbers,errMsgs:errArr}
            });
            setLoading(false);
            return;
        }
        else{
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/v1/universities',
            {
                name:universityName,
                address: universityAddress,
                website : universityWebsite,
                contactNo: {
                    data : uniContactNumbers.numbers,
                },
                faxNo : {
                    data : uniFaxNumbers.numbers,
                },
                cqaFaxNo: {
                    data : cqaFaxNumbers.numbers,
                },
                cqaContactNo: {
                    data : cqaContactNumbers.numbers,
                },
                cqaEmail: cqaEmail,
            }
            ).then(res => {
                console.log(res.data);
                setResponseMsg(res.statusText);
                setAdded(true);
                setLoading(false);
                setTimeout(() => {
                    navigate('../',{ replace: true });
                }, 1000);
            })
            .catch(err => {
                console.log("message : ",err?.response?.data?.message);
                console.log("errors : ",err?.response?.data?.errors);
                setResponseMsg(err?.response?.data?.message);
                setFailed(true);
                setLoading(false);
            });            
        } 
    }

    const handleAddUniContactNumber = (index) => {
        setUniContactNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return {numbers:[...prev.numbers,''],errMsgs:[...errArr,{err:{error:false},msg:''}]}
        })
    }

    const handleRemoveUniContactNumber = (index) => {
        setUniContactNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return {numbers:prev.numbers.filter((item,i) => i!==index),errMsgs:prev.errMsgs.filter((item,i) => i!==index)}
        })
    }

    const handleAddUniFaxNumber = (index) => {
        setUniFaxNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return {numbers:[...prev.numbers,''],errMsgs:[...errArr,{err:{error:false},msg:''}]}
        })
    }

    const handleRemoveUniFaxNumber = (index) => {
        setUniFaxNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return {numbers:prev.numbers.filter((item,i) => i!==index),errMsgs:prev.errMsgs.filter((item,i) => i!==index)}
        })
    }

    const handleAddCqaContactNumber = (index) => {
        setCqaContactNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return {numbers:[...prev.numbers,''],errMsgs:[...errArr,{err:{error:false},msg:''}]}
        })
    }
    
    const handleRemoveCqaContactNumber = (index) => {
        setCqaContactNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return {numbers:prev.numbers.filter((item,i) => i!==index),errMsgs:prev.errMsgs.filter((item,i) => i!==index)}
        })
    }

    const handleAddCqaFaxNumber = (index) => {
        setCqaFaxNumbers((prev) => {
            let errArr = prev.errMsgs;
            // errArr.splice(index+1,0,{err:{error:false},msg:''});
            return {numbers:[...prev.numbers,''],errMsgs:[...errArr,{err:{error:false},msg:''}]}
        })
    }

    const handleRemoveCqaFaxNumber = (index) => {
        setCqaFaxNumbers((prev) => {
            // let errArr = prev.errMsgs;
            // errArr.splice(index,1);
            return {numbers:prev.numbers.filter((item,i) => i!==index),errMsgs:prev.errMsgs.filter((item,i) => i!==index)}
        })
    }

  return (
    <>
    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',padding:'20px',backgroundColor:'#f5f5f5',borderRadius:'10px'}}>
        <form style={{display:"flex",flexWrap:'wrap',width:'90%',justifyContent:'center',alignItems:'flex-start'}} onSubmit={handleClickAddUniversity}>
            <FormControl sx={{padding:"15px 10px",width:'50%',boxSizing:'border-box'}} {...universityNameError.err} variant="standard">
                <InputLabel htmlFor="university-name"><b>University Name</b></InputLabel>
                <Input
                required
                // autoComplete='off'
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                id="uniName"
                aria-describedby="university-name"
                type='text'
                />
                {universityNameError.err.error && <FormHelperText id="university-name-error-text">{universityNameError.msg}</FormHelperText>}
            </FormControl>

            <FormControl sx={{padding:"15px 10px",width:'50%',boxSizing:'border-box'}} {...universityAddressError.err} variant="standard">
                <InputLabel htmlFor="university-address"><b>University Address</b></InputLabel>
                <Input
                required
                // autoComplete='off'
                value={universityAddress}
                onChange={(e) => setUniversityAddress(e.target.value)}
                id="uniAddress"
                type='text'
                aria-describedby="university-address"
                />
                {universityAddressError.err.error && <FormHelperText id="university-address-error-text">{universityAddressError.msg}</FormHelperText>}
            </FormControl>

            <FormControl sx={{padding:"15px 10px",width:'50%',boxSizing:'border-box'}} {...universityWebsiteError.err} variant="standard">
                <InputLabel htmlFor="university-website"><b>University Website</b></InputLabel>
                <Input
                required
                // autoComplete='off'
                value={universityWebsite}
                onChange={(e) => setUniversityWebsite(e.target.value)}
                id="uniWebsite"
                type='url'
                aria-describedby="university-website"
                />
                {universityWebsiteError.err.error && <FormHelperText id="university-website-error-text">{universityWebsiteError.msg}</FormHelperText>}
            </FormControl>

            <FormControl sx={{padding:"15px 10px",width:'50%',boxSizing:'border-box'}} {...cqaEmailError.err} variant="standard">
                <InputLabel htmlFor="cqa-email"><b>QAC Email</b></InputLabel>
                <Input
                required
                // autoComplete='off'
                value={cqaEmail}
                onChange={(e) => setCqaEmail(e.target.value)}
                id="cqaEmail"
                aria-describedby="cqa-email"
                type='email'
                />
                {cqaEmailError.err.error && <FormHelperText id="cqa-email-error-text">{cqaEmailError.msg}</FormHelperText>}
            </FormControl>
            <div style={{width:'25%',margin:'10px 0'}}>
                <InputLabel style={{margin:'10px 0 20px'}} htmlFor="uni-contact-no"><b>University Contact Number(s)</b></InputLabel>
                {uniContactNumbers.numbers.map((contactNumber,index) => 
                    {//console.log("contact number : ",index);
                        return(
                        <div key={index} style={{display:'flex',alignItems:'center',paddingRight:'20px'}}>
                        <FormControl sx={{padding:"15px 5px",boxSizing:'border-box'}} fullWidth {...uniContactNumbers.errMsgs[index].err} variant="standard">
                            <InputLabel sx={{fontSize:"15px",padding:"0 0 0 10px"}} htmlFor="uni-contact-no">Contact Number {index+1}</InputLabel>
                            <Input
                            required
                            // autoComplete='off'
                            type="number"
                            value={contactNumber}
                            onChange={
                                (e) => {
                                    setUniContactNumbers((prev) => {
                                        let errArr = prev.errMsgs;
                                        return {numbers:prev.numbers.map((number,i) => i === index ? e.target.value : number),errMsgs:errArr}
                                })}}
                            id="uniContactNo"
                            aria-describedby="uni-contact-no"
                            />
                            {uniContactNumbers.errMsgs[index].err.error && <FormHelperText id="uni-contact-no">{uniContactNumbers.errMsgs[index].msg}</FormHelperText>}
                            
                        </FormControl>
                        {uniContactNumbers.numbers.length === index+1 && index!==0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveUniContactNumber(index)} style={{cursor:'pointer',color:'red',margin:'0 0 0 10px'}} />}
                        {uniContactNumbers.numbers.length === index+1 && <AddCircleOutlineIcon onClick={() => handleAddUniContactNumber(index+1)} style={{cursor:'pointer',color:'green',margin:'0 0 0 10px'}} />}
                        </div>
                    )
                    })
                }
                
            </div>

            <div style={{width:'25%',margin:'10px 0'}}   >
                <InputLabel style={{margin:'10px 0 20px'}} htmlFor="uni-contact-no"><b>University Fax Number(s)</b></InputLabel>
                {uniFaxNumbers.numbers.map((FaxNumber,index) => 
                    {
                        return(
                        <div key={index} style={{display:'flex',alignItems:'center',paddingRight:'20px'}}>
                        <FormControl sx={{padding:"15px 5px",boxSizing:'border-box'}} fullWidth {...uniFaxNumbers.errMsgs[index].err} variant="standard">
                            <InputLabel sx={{fontSize:"15px",padding:"0 0 0 10px"}} htmlFor="uni-fax-no">Fax Number {index+1}</InputLabel>
                            <Input
                            required
                            // autoComplete='off'
                            type="number"
                            value={FaxNumber}
                            onChange={
                                (e) => {
                                    setUniFaxNumbers((prev) => {
                                        let errArr = prev.errMsgs;
                                        return {numbers:prev.numbers.map((number,i) => i === index ? e.target.value : number),errMsgs:errArr}
                                })}}
                            id="uniFaxNo"
                            aria-describedby="uni-fax-no"
                            />
                            {uniFaxNumbers.errMsgs[index].err.error && <FormHelperText id="uni-fax-no">{uniFaxNumbers.errMsgs[index].msg}</FormHelperText>}
                            
                        </FormControl>
                        {uniFaxNumbers.numbers.length === index+1 && index!==0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveUniFaxNumber(index)} style={{cursor:'pointer',color:'red',margin:'0 0 0 10px'}} />}
                        {uniFaxNumbers.numbers.length === index+1 && <AddCircleOutlineIcon onClick={() => handleAddUniFaxNumber(index+1)} style={{cursor:'pointer',color:'green',margin:'0 0 0 10px'}} />}
                        </div>
                    )
                    })
                }
                
            </div>

            <div style={{width:'25%',margin:'10px 0'}}   >
                <InputLabel style={{margin:'10px 0 20px'}} htmlFor="cqa-contact-no"><b>CQA Contact Number(s)</b></InputLabel>
                {cqaContactNumbers.numbers.map((contactNo,index) => 
                    {
                        return(
                        <div key={index} style={{display:'flex',alignItems:'center',paddingRight:'20px'}}>
                        <FormControl sx={{padding:"15px 5px",boxSizing:'border-box'}} fullWidth {...cqaContactNumbers.errMsgs[index].err} variant="standard">
                            <InputLabel sx={{fontSize:"15px",padding:"0 0 0 10px"}} htmlFor="cqa-contact-no">Contact Number {index+1}</InputLabel>
                            <Input
                            required
                            // autoComplete='off'
                            type="number"
                            value={contactNo}
                            onChange={
                                (e) => {
                                    setCqaContactNumbers((prev) => {
                                        let errArr = prev.errMsgs;
                                        return {numbers:prev.numbers.map((number,i) => i === index ? e.target.value : number),errMsgs:errArr}
                                })}}
                            id="cqaContactNo"
                            aria-describedby="cqa-contact-no"
                            />
                            {cqaContactNumbers.errMsgs[index].err.error && <FormHelperText id="cqa-contact-no">{cqaContactNumbers.errMsgs[index].msg}</FormHelperText>}
                            
                        </FormControl>
                        {cqaContactNumbers.numbers.length === index+1 && index!==0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveCqaContactNumber(index)} style={{cursor:'pointer',color:'red',margin:'0 0 0 10px'}} />}
                        {cqaContactNumbers.numbers.length === index+1 && <AddCircleOutlineIcon onClick={() => handleAddCqaContactNumber(index+1)} style={{cursor:'pointer',color:'green',margin:'0 0 0 10px'}} />}
                        </div>
                    )
                    })
                }
                
            </div>

            <div style={{width:'25%',margin:'10px 0'}}   >
                <InputLabel style={{margin:'10px 0 20px'}} htmlFor="cqa-fax-no"><b>CQA Fax Number(s)</b></InputLabel>
                {cqaFaxNumbers.numbers.map((FaxNumber,index) =>
                    {
                        return(
                        <div key={index} style={{display:'flex',alignItems:'center',paddingRight:'20px'}}>
                        <FormControl sx={{padding:"15px 5px",boxSizing:'border-box'}} fullWidth {...cqaFaxNumbers.errMsgs[index].err} variant="standard">
                            <InputLabel sx={{fontSize:"15px",padding:"0 0 0 10px"}} htmlFor="cqa-fax-no">Fax Number {index+1}</InputLabel>
                            <Input
                            required
                            // autoComplete='off'
                            type="number"
                            value={FaxNumber}
                            onChange={
                                (e) => {
                                    setCqaFaxNumbers((prev) => {
                                        let errArr = prev.errMsgs;
                                        return {numbers:prev.numbers.map((number,i) => i === index ? e.target.value : number),errMsgs:errArr}
                                })}}
                            id="cqaFaxNo"
                            aria-describedby="cqa-fax-no"
                            />
                            {cqaFaxNumbers.errMsgs[index].err.error && <FormHelperText id="cqa-fax-no">{cqaFaxNumbers.errMsgs[index].msg}</FormHelperText>}
                            
                        </FormControl>
                        {cqaFaxNumbers.numbers.length === index+1 && index!==0 && <RemoveCircleOutlineIcon onClick={() => handleRemoveCqaFaxNumber(index)} style={{cursor:'pointer',color:'red',margin:'0 0 0 10px'}} />}
                        {cqaFaxNumbers.numbers.length === index+1 && <AddCircleOutlineIcon onClick={() => handleAddCqaFaxNumber(index+1)} style={{cursor:'pointer',color:'green',margin:'0 0 0 10px'}} />}
                        </div>
                    )
                    })
                }

            </div>

            {/* show errors */}
            <Button style={{margin:"20px 0 15px",width:'200px'}} type='submit' color='primary' variant="contained" fullWidth
            >
            {loading ? <CircularProgress thickness={6} color='secondary' size={24} /> : 'add'}
            </Button>

            <Snackbar
                open={failed}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => {setFailed(false);setResponseMsg('')}}
            >
                <Alert onClose={() => {setFailed(false);setResponseMsg('');}} severity="error">
                    {responseMsg}
                </Alert>
            </Snackbar>
            <Snackbar
                open={added}
                autoHideDuration={1000}
                onClose={() => {setAdded(false);setResponseMsg('')}}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => {setAdded(false);setResponseMsg('');}} severity="success">
                    {responseMsg}
                </Alert>
            </Snackbar>

        </form>
        </Box>
    </>
  )
}

export default AddUniversity